import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { BullBoardModule } from "@bull-board/nestjs";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

/**
 * *Due to limitations in the @bull-board/nestjs package,
 * the BullBoardModule.forFeature calls require hardcoded queue names that must match the environment variables.*
 */

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: parseInt(configService.get("REDIS_PORT")),
        },
      }),
      inject: [ConfigService],
    }),
    // Register the queues with their exact names
    BullModule.registerQueue(
      {
        name: "thena-platform-events",
      },
      {
        name: "thena-platform-installations",
      }
    ),
    BullBoardModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const queueMonitorEnabled =
          configService.get("QUEUE_MONITOR") === "true";
        const username = configService.get("QUEUE_MONITOR_USERNAME");
        const password = configService.get("QUEUE_MONITOR_PASSWORD");

        return {
          route: "/admin/queues",
          adapter: ExpressAdapter,
          mountpath: "/admin/queues",
          options: {
            enabled: queueMonitorEnabled,
            uiConfig: {
              boardTitle: "Queue Monitor",
            },
          },
          middleware: [
            (req, res, next) => {
              const authHeader = req.headers.authorization;

              if (!authHeader || !authHeader.startsWith("Basic ")) {
                res.setHeader("WWW-Authenticate", "Basic");
                res.status(401).send("Authentication required");
                return;
              }

              const base64Credentials = authHeader.split(" ")[1];
              const credentials = Buffer.from(
                base64Credentials,
                "base64"
              ).toString("utf-8");
              const [user, pass] = credentials.split(":");

              if (user === username && pass === password) {
                next();
              } else {
                res.setHeader("WWW-Authenticate", "Basic");
                res.status(401).send("Invalid credentials");
              }
            },
          ],
        };
      },
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature({
      name: "thena-platform-events",
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: "thena-platform-installations",
      adapter: BullAdapter,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}

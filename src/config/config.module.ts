import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "crypto";
import * as rTracer from "cls-rtracer";
import { configuration } from "./configuration";
import { validationSchema } from "./validation";

function customLogLevel(req, res, err) {
  if (res.statusCode >= 500 || err) return "error";
  if (res.statusCode >= 400) return "warn";
  return "info";
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: (config: Record<string, any>) => {
        try {
          const validatedConfig = validationSchema.parse(config);
          return validatedConfig;
        } catch (error) {
          // Provide more detailed error information
          if (error.errors) {
            const details = error.errors
              .map((err) => `${err.path}: ${err.message}`)
              .join(", ");
            throw new Error(`Configuration validation failed: ${details}`);
          }
          throw new Error(`Configuration validation failed: ${error.message}`);
        }
      },
    }),

    LoggerModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService: ConfigService) => {
        const loggerConfig = {
          pinoHttp: {
            level: configService.get("LOG_LEVEL", "info"),
            customLogLevel,
            autoLogging: {
              ignore: (req) => {
                // Ignore Bull Board polling requests to reduce log noise
                if (req.url && req.url.includes("/admin/queues/api/queues")) {
                  return true;
                }
                // Don't ignore other requests
                return false;
              },
            },
            mixin: () => {
              // Add the request ID from cls-rtracer to every log
              const requestId = rTracer.id();
              return {
                requestId: requestId || "no-request-id",
              };
            },
            // Customize request serialization to reduce verbosity
            serializers: {
              req: (req) => {
                // Check if extended logs are enabled
                const extendedLogs =
                  configService.get("EXTENDED_LOGS", "false") === "true";

                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                  // Only include minimal query and params info
                  query: Object.keys(req.query || {}).length ? "..." : {},
                  params: Object.keys(req.params || {}).length ? "..." : {},
                  // Only include headers if extended logs are enabled
                  ...(extendedLogs && {
                    headers: {
                      "user-agent": req.headers["user-agent"],
                      "content-type": req.headers["content-type"],
                      "content-length": req.headers["content-length"],
                      accept: req.headers["accept"],
                      referer: req.headers["referer"],
                      origin: req.headers["origin"],
                    },
                  }),
                  // Don't log request body or cookies
                  remoteAddress: req.remoteAddress,
                };
              },
              res: (res) => {
                // Check if extended logs are enabled
                const extendedLogs =
                  configService.get("EXTENDED_LOGS", "false") === "true";

                // Try to parse the response body if it's JSON
                let body = null;
                if (
                  res.headers &&
                  res.headers["content-type"] &&
                  res.headers["content-type"].includes("application/json") &&
                  res.body
                ) {
                  try {
                    body =
                      typeof res.body === "string"
                        ? JSON.parse(res.body)
                        : res.body;
                  } catch (e) {
                    // If we can't parse it, just use it as is
                    body = res.body;
                  }
                }

                return {
                  statusCode: res.statusCode,
                  // Only include headers if extended logs are enabled
                  ...(extendedLogs && {
                    headers: res.headers
                      ? {
                          "content-type": res.headers["content-type"],
                          "content-length": res.headers["content-length"],
                          "cache-control": res.headers["cache-control"],
                          etag: res.headers["etag"],
                        }
                      : {},
                  }),
                  body: body,
                };
              },
            },
            // Set HTTP context
            customProps: (_req, _res) => {
              // Get request ID from rTracer
              const requestId = rTracer.id();
              return {
                context: "HTTP",
                requestId: requestId || "no-request-id",
              };
            },
            transport: {
              target: "pino-pretty",
              options: {
                colorize: configService.get("LOG_COLORS", "false") === "true",
                levelFirst: true,
                translateTime: configService.get(
                  "LOG_TIME_FORMAT",
                  "yyyy-mm-dd HH:MM:ss.l"
                ),
                singleLine:
                  configService.get("LOG_SINGLE_LINE", "false") === "true",
                messageFormat: "[{context}] [{requestId}] {msg}",
                ignore: "pid,hostname,context,requestId",
              },
            },
          },
        };

        return loggerConfig;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [NestConfigModule, LoggerModule],
})
export class ConfigModule implements NestModule {
  // Implement NestModule to configure the rTracer middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        rTracer.expressMiddleware({
          requestIdFactory: () => randomUUID(),
          useHeader: true,
          headerName: "X-Request-Id",
        })
      )
      .forRoutes("*");
  }
}

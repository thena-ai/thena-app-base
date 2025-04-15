import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { RedisService } from "./services/redis.service";
import { RedisClientConfig } from "./interfaces/redis-client.interface";

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        const config: RedisClientConfig = {
          host: configService.get("redis.host"),
          port: configService.get("redis.port"),
          password: configService.get("redis.password"),
          db: configService.get("redis.db"),
          lazyConnect: true,
        };

        const client = new Redis(config);

        client.on("error", (err) => console.error("Redis Client Error:", err));
        client.on("connect", () => console.log("Redis Client Connected"));

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}

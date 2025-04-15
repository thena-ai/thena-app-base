import { Module } from "@nestjs/common";
import { RedisModule } from "./redis/redis.module";
import { DatabaseModule } from "./database/database.module";
import { QueueModule } from "./queue/queue.module";
import { ConfigModule } from "./config/config.module";

@Module({
  imports: [
    // Configuration and Logger
    ConfigModule,

    // Database
    DatabaseModule,

    // Queue
    QueueModule,

    // Redis Cache
    RedisModule,
  ],
})
export class AppModule {}

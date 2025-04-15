import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { ThenaController } from "./thena.controller";
import { ThenaService } from "./thena.service";
import { RedisModule } from "../../redis/redis.module";
import { EventProcessor } from "./processors/event.processor";
import { InstallationProcessor } from "./processors/installation.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    BullModule.registerQueue(
      {
        name: "thena-platform-events",
      },
      {
        name: "thena-platform-installations",
      }
    ),
    RedisModule,
  ],
  controllers: [ThenaController],
  providers: [ThenaService, EventProcessor, InstallationProcessor],
})
export class ThenaModule {}

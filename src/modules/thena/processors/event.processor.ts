import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor("thena-platform-events")
export class EventProcessor {
  private readonly logger = new Logger(EventProcessor.name);

  @Process("process-event")
  async handleEvent(job: Job<any>) {
    this.logger.log(`Processing event job ${job.id}`);
    this.logger.debug("Event payload:", job.data.payload);
    this.logger.debug("Event timestamp:", job.data.timestamp);

    // Add your event processing logic here
    // For now, we'll just log the event

    this.logger.log(`Event job ${job.id} processed successfully`);
    return { success: true };
  }
}

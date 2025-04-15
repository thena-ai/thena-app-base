import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";

@Processor("thena-platform-installations")
export class InstallationProcessor {
  private readonly logger = new Logger(InstallationProcessor.name);

  @Process("process-installation")
  async handleInstallation(job: Job<any>) {
    this.logger.log(`Processing installation job ${job.id}`);
    this.logger.debug("Installation payload:", job.data.payload);
    this.logger.debug("Installation timestamp:", job.data.timestamp);

    // Add your installation processing logic here
    // For now, we'll just log the installation event

    this.logger.log(`Installation job ${job.id} processed successfully`);
    return { success: true };
  }
}

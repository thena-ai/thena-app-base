import { Injectable, Logger } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue, JobOptions } from "bull";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";

interface QueueResponse {
  status: string;
  message: string;
  jobId: string;
}

@Injectable()
export class ThenaService {
  private readonly logger = new Logger(ThenaService.name);
  private readonly defaultJobOptions: JobOptions = {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
  };

  constructor(
    @InjectQueue("thena-platform-events")
    private readonly eventQueue: Queue,
    @InjectQueue("thena-platform-installations")
    private readonly installationQueue: Queue
  ) {}

  processEvent(payload: any): Observable<QueueResponse> {
    this.logger.log("Adding event to queue");
    return from(
      this.eventQueue.add(
        "process-event",
        {
          payload,
          timestamp: new Date().toISOString(),
        },
        this.defaultJobOptions
      )
    ).pipe(
      map((job) => ({
        status: "ok",
        message: "Event queued successfully",
        jobId: job.id.toString(),
      }))
    );
  }

  processInstallation(payload: any): Observable<QueueResponse> {
    this.logger.log("Adding installation to queue");
    return from(
      this.installationQueue.add(
        "process-installation",
        {
          payload,
          timestamp: new Date().toISOString(),
        },
        this.defaultJobOptions
      )
    ).pipe(
      map((job) => ({
        status: "ok",
        message: "Installation queued successfully",
        jobId: job.id.toString(),
      }))
    );
  }
}

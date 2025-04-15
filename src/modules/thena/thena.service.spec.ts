import { Test, TestingModule } from "@nestjs/testing";
import { getQueueToken } from "@nestjs/bull";
import { ThenaService } from "./thena.service";
import { Queue } from "bull";
import { lastValueFrom } from "rxjs";

describe("ThenaService", () => {
  let service: ThenaService;
  let eventQueue: Queue;
  let installationQueue: Queue;

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThenaService,
        {
          provide: getQueueToken("thena-platform-events"),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken("thena-platform-installations"),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<ThenaService>(ThenaService);
    eventQueue = module.get<Queue>(getQueueToken("thena-platform-events"));
    installationQueue = module.get<Queue>(
      getQueueToken("thena-platform-installations")
    );

    // Mock Date.now() to return a fixed timestamp
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-04-15T11:29:14.729Z"));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("processEvent", () => {
    const mockPayload = { type: "test-event" };
    const mockJob = { id: "123" };

    beforeEach(() => {
      mockQueue.add.mockResolvedValue(mockJob);
    });

    it("should add event to queue with default options", async () => {
      const result = await lastValueFrom(service.processEvent(mockPayload));

      expect(eventQueue.add).toHaveBeenCalledWith(
        "process-event",
        {
          payload: mockPayload,
          timestamp: "2025-04-15T11:29:14.729Z",
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
        }
      );
      expect(result).toEqual({
        status: "ok",
        message: "Event queued successfully",
        jobId: mockJob.id,
      });
    });

    it("should handle queue errors", async () => {
      const error = new Error("Queue error");
      mockQueue.add.mockRejectedValue(error);

      try {
        await lastValueFrom(service.processEvent(mockPayload));
        fail("Expected error to be thrown");
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });

  describe("processInstallation", () => {
    const mockPayload = { type: "test-installation" };
    const mockJob = { id: "456" };

    beforeEach(() => {
      mockQueue.add.mockResolvedValue(mockJob);
    });

    it("should add installation to queue with default options", async () => {
      const result = await lastValueFrom(
        service.processInstallation(mockPayload)
      );

      expect(installationQueue.add).toHaveBeenCalledWith(
        "process-installation",
        {
          payload: mockPayload,
          timestamp: "2025-04-15T11:29:14.729Z",
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
        }
      );
      expect(result).toEqual({
        status: "ok",
        message: "Installation queued successfully",
        jobId: mockJob.id,
      });
    });

    it("should handle queue errors", async () => {
      const error = new Error("Queue error");
      mockQueue.add.mockRejectedValue(error);

      try {
        await lastValueFrom(service.processInstallation(mockPayload));
        fail("Expected error to be thrown");
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  });
});

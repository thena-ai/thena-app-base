import { Test, TestingModule } from "@nestjs/testing";
import { ThenaController } from "./thena.controller";
import { ThenaService } from "./thena.service";
import { ConfigService } from "@nestjs/config";
import { of } from "rxjs";

describe("ThenaController", () => {
  let controller: ThenaController;
  let thenaService: ThenaService;

  const mockThenaService = {
    processEvent: jest.fn(),
    processInstallation: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThenaController],
      providers: [
        {
          provide: ThenaService,
          useValue: mockThenaService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<ThenaController>(ThenaController);
    thenaService = module.get<ThenaService>(ThenaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("handleEvents", () => {
    const mockEventPayload = { type: "test-event" };
    const mockResponse = {
      status: "ok",
      message: "Event processed",
      jobId: "123",
    };

    beforeEach(() => {
      mockThenaService.processEvent.mockReturnValue(of(mockResponse));
    });

    it("should process events successfully", async () => {
      const result = await controller.handleEvents(mockEventPayload);

      expect(thenaService.processEvent).toHaveBeenCalledWith(mockEventPayload);
      expect(result).toEqual(mockResponse);
    });

    it("should handle service errors", async () => {
      const errorResponse = {
        status: "error",
        message: "Failed to process event",
        jobId: "",
      };
      mockThenaService.processEvent.mockReturnValue(of(errorResponse));

      const result = await controller.handleEvents(mockEventPayload);

      expect(result).toEqual(errorResponse);
    });
  });

  describe("handleInstallations", () => {
    const mockInstallationPayload = {
      type: "test-installation",
    };
    const mockResponse = {
      status: "ok",
      message: "Installation processed",
      jobId: "456",
    };

    beforeEach(() => {
      mockThenaService.processInstallation.mockReturnValue(of(mockResponse));
    });

    it("should process installations successfully", async () => {
      const result = await controller.handleInstallations(
        mockInstallationPayload
      );

      expect(thenaService.processInstallation).toHaveBeenCalledWith(
        mockInstallationPayload
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle service errors", async () => {
      const errorResponse = {
        status: "error",
        message: "Failed to process installation",
        jobId: "",
      };
      mockThenaService.processInstallation.mockReturnValue(of(errorResponse));

      const result = await controller.handleInstallations(
        mockInstallationPayload
      );

      expect(result).toEqual(errorResponse);
    });
  });
});

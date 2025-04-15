import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Headers,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ThenaService } from "./thena.service";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";

interface WebhookResponse {
  status: string;
  message: string;
  jobId?: string;
}

@ApiTags("webhooks")
@Controller()
export class ThenaController {
  private readonly logger = new Logger(ThenaController.name);

  constructor(
    private readonly thenaService: ThenaService,
    private readonly configService: ConfigService
  ) {}

  @Post("events")
  @ApiOperation({ summary: "Webhook endpoint for Thena platform events" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Event processed successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid event payload",
  })
  async handleEvents(@Body() eventPayload: any): Promise<WebhookResponse> {
    return firstValueFrom(this.thenaService.processEvent(eventPayload));
  }

  @Post("installations")
  @ApiOperation({ summary: "Webhook endpoint for Thena installations events" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Installation processed successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid installation payload",
  })
  async handleInstallations(
    @Body() installationPayload: any
  ): Promise<WebhookResponse> {
    return firstValueFrom(
      this.thenaService.processInstallation(installationPayload)
    );
  }
}

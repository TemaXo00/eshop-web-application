import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: "Greeting",
    description: 'Greeting and docs redirect',
  })
  @ApiOkResponse({
    description: 'Return Success and link to docs',
  })
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @ApiOperation({
    summary: "DB Health",
    description: 'Check DB and Prisma database',
  })
  @ApiOkResponse({
    description: "Return Success",
    example: {
      status: "OK",
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Return Error if not connect to DB",
    example: {
      status: "ERROR",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      message: "Error message",
    }
  })
  @Get('health')
  getDBHealth() {
    return this.appService.health();
  }
}

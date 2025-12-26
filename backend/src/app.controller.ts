import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Greeting',
    description: 'Greeting and docs link',
  })
  @ApiOkResponse({
    description: 'Return Success and link to docs',
  })
  @Get()
  greeting() {
    return this.appService.greeting();
  }

  @ApiOperation({
    summary: 'DB Health',
    description: 'Check DB and Prisma health',
  })
  @ApiOkResponse({
    description: 'Return Success',
    example: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Return error if not connect to DB or Prisma error',
    example: {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      message: 'Error message',
    },
  })
  @Get('db-health')
  getDBHealth() {
    return this.appService.Dbhealth();
  }
}

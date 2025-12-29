import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  greeting() {
    return {
      greeting: 'Welcome to EShop API',
      status: 'OK',
      backend: 'Nest JS',
      frontend: 'Vue JS',
      author: 'TemaXo00'
    };
  }

  async Dbhealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: 'connected',
      };
    } catch (e) {
      throw new InternalServerErrorException({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        message: e.message,
      });
    }
  }
}

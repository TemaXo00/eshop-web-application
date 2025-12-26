import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtil {
  parseTTL(ttlString: string): Date {
    const regex = /^(\d+)([dhmsw])$/;
    const match = ttlString.match(regex);

    if (!match) {
      throw new Error(`Invalid TTL format: ${ttlString}`);
    }

    const value = parseInt(match[1]);
    const unit = match[2];
    const now = Date.now();

    switch (unit) {
      case 'd':
        return new Date(now + value * 24 * 60 * 60 * 1000);
      case 'h':
        return new Date(now + value * 60 * 60 * 1000);
      case 'm':
        return new Date(now + value * 60 * 1000);
      case 's':
        return new Date(now + value * 1000);
      case 'w':
        return new Date(now + value * 7 * 24 * 60 * 60 * 1000);
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
  }
}

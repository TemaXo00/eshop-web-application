import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    description: 'User accessToken',
    example: 'eisnfosinfios...',
  })
  accessToken: string;
}

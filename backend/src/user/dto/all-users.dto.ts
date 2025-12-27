import { ApiProperty } from '@nestjs/swagger';

export class AllUsersDto {
  @ApiProperty({
    description: 'User ID',
    example: '1',
  })
  id: number;
  @ApiProperty({
    description: 'User first name',
    example: 'Michael',
  })
  first_name: string;
  @ApiProperty({
    description: 'User last name',
    example: 'Keely',
  })
  last_name: string;
  @ApiProperty({
    description: 'Username',
    example: 'MichaelKeely123',
  })
  username: string;
  @ApiProperty({
    description: 'User role',
    example: 'USER',
  })
  role: string;
  @ApiProperty({
    description: 'User status',
    example: 'ACTIVE',
  })
  status: string;
  @ApiProperty({
    description: 'User create date',
    example: '2025-12-26T1818:48:00.188Z',
  })
  createdAt: Date;
}

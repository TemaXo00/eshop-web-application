import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User first name',
    example: 'Michael',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Kelly',
    required: false,
  })
  last_name?: string;

  @ApiProperty({
    description: 'Username',
    example: 'MichaelKelly123',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'ADMIN', 'MODERATOR'],
  })
  role: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+375291234567',
  })
  phone: string;

  @ApiProperty({
    description: "User's email",
    example: 'example@example.com',
  })
  email: string;
}

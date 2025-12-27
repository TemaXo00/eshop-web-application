import { ApiProperty } from '@nestjs/swagger';

export class UserByIdDto {
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
        description: 'Avatar url',
        example: 'https://example.com/avatar.png',
        required: false,
    })
    avatar_url?: string;

    @ApiProperty({
        description: 'User stats',
        example: 'ACTIVE',
    })
    status: string;

    @ApiProperty({
        description: 'User role',
        example: 'USER',
    })
    role: string;

    @ApiProperty({
        description: 'User store (only for employee)',
        example: 'NULL',
    })
    store: object

    @ApiProperty({
        description: 'User reviews',
        example: '[]',
    })
    reviews: object[]
    @ApiProperty({
        description: 'User create date',
        example: '2025-12-26T1818:48:00.188Z'
    })
    createdAt: Date;
}

import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
    @ApiProperty({
        description: 'Name of the store',
        example: 'Fresh Market',
        minLength: 3,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 50)
    name: string;

    @ApiProperty({
        description: 'Physical address of the store',
        example: '123 Main Street, New York, NY 10001',
        minLength: 3,
        maxLength: 70,
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 70)
    address: string;

    @ApiProperty({
        description: 'Contact email for the store',
        example: 'info@freshmarket.com',
        minLength: 3,
        maxLength: 70,
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 70)
    email: string;

    @ApiProperty({
        description: 'URL to store image',
        example: 'https://example.com/store-image.jpg',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^(https?:\/\/|\/|data:image\/)/)
    store_image?: string;

    @ApiProperty({
        description: 'Store opening time in HH:MM or HH:MM:SS format',
        example: '09:00:00',
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const [hours, minutes, seconds = '00'] = value.split(':');
            const date = new Date(1970, 0, 1);
            date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
            return date;
        }
        return value;
    })
    opening_time: Date;

    @ApiProperty({
        description: 'Store closing time in HH:MM or HH:MM:SS format',
        example: '21:00:00',
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const [hours, minutes, seconds = '00'] = value.split(':');
            const date = new Date(1970, 0, 1);
            date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
            return date;
        }
        return value;
    })
    closing_time: Date;
}
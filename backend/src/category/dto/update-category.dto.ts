import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'description',
    example: 'Mobile gadget',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/|data:image\/)/)
  image_url: string;
}

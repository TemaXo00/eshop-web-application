import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'name',
    example: 'Phone',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;
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

import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: "User's email",
        example: 'example@example.com',
        minLength: 3,
        maxLength: 60,
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @Length(3, 60)
    email: string;
    @ApiProperty({
        description: 'User password',
        example: 'Aa$1bcde',
        minLength: 8,
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
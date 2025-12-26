import {applyDecorators} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";

export function JwtSwagger() {
    return applyDecorators(ApiBearerAuth('JWT-auth'))
}
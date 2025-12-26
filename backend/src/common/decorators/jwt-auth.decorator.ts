import {applyDecorators} from "@nestjs/common";
import {ApiBearerAuth} from "@nestjs/swagger";

export function JwtAuth() {
    return applyDecorators(ApiBearerAuth('JWT-auth'))
}
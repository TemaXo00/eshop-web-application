import {createParamDecorator, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import { User } from "../../../prisma/generated/prisma/client";
import { Request } from 'express'

export const Authorized = createParamDecorator(
    (data: keyof User | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;
        const user = request.user as User;

        if (!user) {
            throw new UnauthorizedException('User not authorized');
        }

        return data ? user[data] : user;
    }
)
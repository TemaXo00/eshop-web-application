import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {jwtConfig} from "../config/jwt.config";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {PassportModule} from "@nestjs/passport";
import {DateUtil} from "../common/utils/parse-data.util";

@Module({
  imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: jwtConfig,
      }),
      PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, DateUtil],
})
export class AuthModule {}

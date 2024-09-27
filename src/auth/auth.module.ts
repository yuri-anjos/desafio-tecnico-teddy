import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './components/local.strategy';
import { ConfigModule } from '@nestjs/config';
import envVariables from '../config/configuration';
import { JwtStrategy } from './components/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(envVariables),
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}

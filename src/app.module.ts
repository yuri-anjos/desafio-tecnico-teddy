import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CompactUrl } from './compact-url/compact-url.entity';
import { ConfigModule } from '@nestjs/config';
import { CompactUrlModule } from './compact-url/compact-url.module';
import envVariables from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envVariables],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, CompactUrl],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CompactUrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

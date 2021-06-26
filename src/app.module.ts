import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminMenuModule } from './modules/admin-menu/admin-menu.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    ConfigModule.forRoot(),
    AdminMenuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

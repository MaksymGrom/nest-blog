import { Module } from '@nestjs/common';
import { MenuController } from './controllers/menu.controller';

@Module({
  controllers: [
    MenuController,
  ]
})
export class AdminMenuModule {}

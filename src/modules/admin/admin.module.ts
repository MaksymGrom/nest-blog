import { Module } from '@nestjs/common';
import { AdminRepository } from './service/admin.repository';

@Module({
  providers: [AdminRepository],
  exports: [AdminRepository]
})
export class AdminModule {}

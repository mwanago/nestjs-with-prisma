import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { DatabaseModule } from '../database/database.module';
import { ReportsService } from './reports.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

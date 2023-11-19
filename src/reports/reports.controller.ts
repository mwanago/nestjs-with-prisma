import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('articles')
  getArticlesStatistics() {
    return this.reportsService.getArticlesStatistics();
  }

  @Get('authors')
  getAuthorsStatistics() {
    return this.reportsService.getAuthorsStatistics();
  }
}

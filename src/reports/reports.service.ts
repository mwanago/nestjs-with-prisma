import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getArticlesStatistics() {
    const result = await this.prismaService.article.aggregate({
      _avg: {
        upvotes: true,
      },
    });
    return {
      averageUpvotesCount: result._avg.upvotes
    }
  }
}

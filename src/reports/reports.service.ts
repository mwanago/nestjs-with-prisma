import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { isRecord } from '../utilities/is-record';

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getArticlesLength() {
    const rawResults = await this.prismaService.$queryRaw`
      SELECT
      max(length(content)) AS longest_article_length,
      min(length(content)) AS shortest_article_length
      FROM "Article"
    `;
    if (!Array.isArray(rawResults)) {
      throw new InternalServerErrorException();
    }
    const result = rawResults[0];
    if (!isRecord(result)) {
      throw new InternalServerErrorException();
    }
    const longestArticleLength = result.longest_article_length;
    const shortestArticleLength = result.shortest_article_length;
    return {
      longestArticleLength,
      shortestArticleLength,
    };
  }

  async getArticlesStatistics() {
    const result = await this.prismaService.article.aggregate({
      _avg: {
        upvotes: true,
      },
      _max: {
        upvotes: true,
      },
    });

    const { longestArticleLength, shortestArticleLength } =
      await this.getArticlesLength();

    return {
      averageUpvotesCount: result._avg.upvotes,
      biggestUpvotesCount: result._max.upvotes,
      longestArticleLength,
      shortestArticleLength,
    };
  }
}

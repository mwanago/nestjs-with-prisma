import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { ArticleNotFoundException } from './article-not-found.exception';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticlesSearchParamsDto } from './dto/articles-search-params.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  search({
    textSearch,
    upvotesGreaterThan,
    categoryName,
    authorNameToAvoid,
  }: ArticlesSearchParamsDto) {
    const searchInputs: Prisma.ArticleWhereInput[] = [];

    if (authorNameToAvoid) {
      searchInputs.push({
        NOT: {
          author: {
            name: authorNameToAvoid,
          },
        },
      });
    }

    if (categoryName) {
      searchInputs.push({
        categories: {
          some: {
            name: categoryName,
          },
        },
      });
    }

    if (textSearch) {
      searchInputs.push({
        OR: [
          {
            content: {
              contains: textSearch,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: textSearch,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (typeof upvotesGreaterThan === 'number') {
      searchInputs.push({
        upvotes: {
          gt: upvotesGreaterThan,
        },
      });
    }

    if (!searchInputs.length) {
      return this.getAll();
    }

    if (searchInputs.length === 1) {
      return this.prismaService.article.findMany({
        where: searchInputs[0],
      });
    }

    return this.prismaService.article.findMany({
      where: {
        AND: searchInputs,
      },
    });
  }

  getAll() {
    return this.prismaService.article.findMany({
      include: {
        author: true,
      },
    });
  }

  async getById(id: number) {
    const article = await this.prismaService.article.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
    if (!article) {
      throw new ArticleNotFoundException(id);
    }
    return article;
  }

  async create(article: CreateArticleDto, authorId: number) {
    const categories = article.categoryIds?.map((id) => {
      return {
        id,
      };
    });

    try {
      return await this.prismaService.article.create({
        data: {
          title: article.title,
          content: article.content,
          author: {
            connect: {
              id: authorId,
            },
          },
          categories: {
            connect: categories,
          },
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new BadRequestException('Wrong category id provided');
      }
      throw error;
    }
  }

  async update(id: number, article: UpdateArticleDto) {
    try {
      return await this.prismaService.article.update({
        data: {
          ...article,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArticleNotFoundException(id);
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.article.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArticleNotFoundException(id);
      }
      throw error;
    }
  }
}

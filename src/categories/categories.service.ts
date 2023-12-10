import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.category.findMany();
  }

  private includeNestedCategories(
    maximumLevel: number,
  ): boolean | Prisma.Category$nestedCategoriesArgs {
    if (maximumLevel === 1) {
      return true;
    }
    return {
      include: {
        nestedCategories: this.includeNestedCategories(maximumLevel - 1),
      },
    };
  }

  async getById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        articles: true,
        nestedCategories: this.includeNestedCategories(10),
      },
    });
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  async create(category: CreateCategoryDto) {
    const nestedCategories =
      category.nestedCategoryIds?.map((id) => ({
        id,
      })) || [];
    try {
      return await this.prismaService.category.create({
        data: {
          name: category.name,
          nestedCategories: {
            connect: nestedCategories,
          },
        },
        include: {
          nestedCategories: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.ConnectedRecordsNotFound
      ) {
        throw new ConflictException(
          'Some of the provided category ids are not valid',
        );
      }
      throw error;
    }
  }

  async update(id: number, category: UpdateCategoryDto) {
    try {
      const nestedCategories =
        category.nestedCategoryIds?.map((id) => ({
          id,
        })) || [];
      return await this.prismaService.category.update({
        data: {
          name: category.name,
          nestedCategories: {
            connect: nestedCategories,
          },
        },
        include: {
          nestedCategories: true,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }
      if (error.code === PrismaError.RecordDoesNotExist) {
        throw new NotFoundException();
      }
      if (error.code === PrismaError.ConnectedRecordsNotFound) {
        throw new ConflictException(
          'Some of the provided category ids are not valid',
        );
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}

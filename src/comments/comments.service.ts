import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.comment.findMany();
  }

  async getById(id: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
    });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async create(comment: CreateCommentDto) {
    try {
      return await this.prismaService.comment.create({
        data: {
          content: comment.content,
          articleId: comment.articleId,
          photoId: comment.photoId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientUnknownRequestError &&
        error.message.includes('check_if_only_one_is_not_null')
      ) {
        throw new BadRequestException(
          'You need to provide exactly one foreign key',
        );
      }
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.ForeignKeyConstraintViolated
      ) {
        throw new BadRequestException(
          'You need to provide a foreign key that matches a valid row',
        );
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.comment.delete({
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

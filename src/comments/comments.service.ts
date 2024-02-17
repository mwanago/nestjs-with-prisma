import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(comment: CreateCommentDto) {
    return this.prismaService.comment.create({
      data: {
        content: comment.content,
        articleId: comment.articleId,
        photoId: comment.photoId,
      },
    });
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

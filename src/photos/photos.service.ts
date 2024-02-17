import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.photo.findMany();
  }

  async getById(id: number) {
    const photo = await this.prismaService.photo.findUnique({
      where: {
        id,
      },
    });
    if (!photo) {
      throw new NotFoundException();
    }
    return photo;
  }

  create(photo: CreatePhotoDto) {
    return this.prismaService.photo.create({
      data: {
        imageUrl: photo.imageUrl,
      },
    });
  }

  async update(id: number, photo: UpdatePhotoDto) {
    try {
      return await this.prismaService.photo.update({
        data: {
          imageUrl: photo.imageUrl,
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
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.photo.delete({
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

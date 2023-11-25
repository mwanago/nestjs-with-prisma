import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        address: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(user: UserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          address: {
            create: user.address,
          },
        },
        include: {
          address: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintViolated
      ) {
        throw new ConflictException('User with that email already exists');
      }
      throw error;
    }
  }

  async delete(userId: number) {
    try {
      return await this.prismaService.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }
      if (error.code === PrismaError.RecordDoesNotExist) {
        throw new NotFoundException();
      }
      const affectedField = error.meta?.field_name;
      if (
        error.code === PrismaError.ForeignKeyConstraintViolated &&
        typeof affectedField === 'string' &&
        affectedField.toLowerCase().includes('article')
      ) {
        throw new ConflictException(
          "Can't remove the user that is an author of some articles",
        );
      }
      throw error;
    }
  }
}

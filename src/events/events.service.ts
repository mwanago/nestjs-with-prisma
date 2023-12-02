import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Range, RANGE_LB_INC, RANGE_UB_INC, serialize } from 'postgres-range';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.$queryRaw`
      SELECT id, name, "dateRange"::text FROM "Event"
    `;
  }

  search(date: string) {
    return this.prismaService.$queryRaw`
      SELECT id, name, "dateRange"::text FROM "Event"
      WHERE "dateRange" @> ${date}::timestamptz
    `;
  }

  async create(eventData: CreateEventDto) {
    const range = new Range(
      eventData.startDate,
      eventData.endDate,
      RANGE_LB_INC | RANGE_UB_INC,
    );

    const queryResponse = await this.prismaService.$queryRaw`
      INSERT INTO "Event"(
        name, "dateRange"  
      )
      VALUES (
        ${eventData.name},
        ${serialize(range)}::tstzrange
      )
      RETURNING id, name, "dateRange"::text
    `;
    if (Array.isArray(queryResponse) && queryResponse.length === 1) {
      return queryResponse[0];
    }
    throw new InternalServerErrorException();
  }
}

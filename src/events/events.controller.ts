import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { FindEventsParamsDto } from './dto/find-events-params.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @TransformPlainToInstance(EventResponseDto)
  getAll(@Query() { date }: FindEventsParamsDto) {
    if (date) {
      return this.eventsService.search(date);
    }
    return this.eventsService.getAll();
  }

  @Post()
  @TransformPlainToInstance(EventResponseDto)
  create(@Body() event: CreateEventDto) {
    return this.eventsService.create(event);
  }
}

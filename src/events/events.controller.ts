import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { TransformPlainToInstance } from 'class-transformer';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @TransformPlainToInstance(EventResponseDto)
  getAll() {
    return this.eventsService.getAll();
  }

  @Post()
  @TransformPlainToInstance(EventResponseDto)
  create(@Body() event: CreateEventDto) {
    return this.eventsService.create(event);
  }
}

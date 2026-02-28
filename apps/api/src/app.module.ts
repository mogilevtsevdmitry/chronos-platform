import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsController } from './events/events.controller';
import { ErasController } from './eras/eras.controller';
import { CalendarController } from './calendar/calendar.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [EventsController, ErasController, CalendarController],
})
export class AppModule {}

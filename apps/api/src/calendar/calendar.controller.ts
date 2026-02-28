import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { gregorianToJdn } from './jdn.utils';

@Controller('calendar')
export class CalendarController {
  @Get('convert')
  convert(@Query('date') date: string, @Query('calendar_type') calType: string) {
    if (!date) throw new BadRequestException('date is required');
    const parts = date.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) throw new BadRequestException('date must be YYYY-MM-DD');
    const jdn = gregorianToJdn(parts[0], parts[1], parts[2]);
    return { date, calendar_type: calType || 'gregorian', jdn: Number(jdn) };
  }
}

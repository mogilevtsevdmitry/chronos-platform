import { Controller, Get, Query, BadRequestException } from '@nestjs/common';

const MAX_JDN_RANGE = 365_000;

@Controller('events')
export class EventsController {
  @Get()
  async getEvents(
    @Query('jdn_start') jdnStart?: string,
    @Query('jdn_end') jdnEnd?: string,
    @Query('limit') limit?: string,
  ) {
    const start = jdnStart ? parseInt(jdnStart, 10) : undefined;
    const end = jdnEnd ? parseInt(jdnEnd, 10) : undefined;

    if (start !== undefined && isNaN(start)) throw new BadRequestException('jdn_start must be integer');
    if (end !== undefined && isNaN(end)) throw new BadRequestException('jdn_end must be integer');
    if (start !== undefined && end !== undefined && (end - start) > MAX_JDN_RANGE) {
      throw new BadRequestException(`JDN range must not exceed ${MAX_JDN_RANGE} days`);
    }

    const parsedLimit = Math.min(parseInt(limit || '50', 10), 1000);
    // TODO: query Prisma
    return { events: [], limit: parsedLimit, jdn_start: start, jdn_end: end };
  }
}

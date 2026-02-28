import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,  // 1 минута в ms
      limit: 100,  // 100 запросов per IP
    }]),
  ],
})
export class AppModule {}

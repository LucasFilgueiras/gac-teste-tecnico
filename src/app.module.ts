import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './health/health.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TransactionsModule,
    StatisticsModule,
    HealthModule,
    ThrottlerModule.forRoot([
      // RATE_LIMIT_TTL requisições a cada RATE_LIMIT_TTL milisegundos
      {
        ttl: parseInt(process.env.RATE_LIMIT_TTL || '60000'),
        limit: parseInt(process.env.RATE_LIMIT_MAX || '10'),
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

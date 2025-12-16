import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [TransactionsModule, StatisticsModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

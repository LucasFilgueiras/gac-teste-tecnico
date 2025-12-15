import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Logger } from 'winston';

@Module({
  imports: [TransactionsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, Logger],
})
export class StatisticsModule {}

import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}

import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { Logger } from 'winston';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository, Logger],
  exports: [TransactionRepository],
})
export class TransactionsModule {}

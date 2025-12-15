import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionRepository],
  exports: [TransactionRepository],
})
export class TransactionsModule {}

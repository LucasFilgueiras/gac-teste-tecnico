import { Injectable } from '@nestjs/common';
import { Statistic } from './entities/statistic.entity';
import { TransactionRepository } from 'src/transactions/repositories/transaction.repository';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionsEmptyException } from 'src/transactions/exceptions/transactions-empty.exception';

@Injectable()
export class StatisticsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getStatistics(): Promise<Statistic> {
    const transactions = await this.transactionRepository.findAll();
    if (transactions.length === 0) throw new TransactionsEmptyException();

    const timeLimit = new Date(Date.now() - 60000);

    const filteredTransactions = transactions.filter(
      (t: Transaction) => new Date(t.timestamp) >= timeLimit,
    );

    if (filteredTransactions.length === 0) return this.getEmptyStatistics();

    return this.calculateStatistics(filteredTransactions);
  }

  private calculateStatistics(filteredTransactions: Transaction[]): Statistic {
    let sum = 0;
    for (const transaction of filteredTransactions) {
      sum += transaction.amount;
    }

    const amounts = filteredTransactions.map((t) => t.amount);
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    const avg = sum / filteredTransactions.length;

    return {
      count: filteredTransactions.length,
      avg,
      max,
      min,
      sum,
    };
  }

  private getEmptyStatistics(): Statistic {
    return { avg: 0, count: 0, max: 0, min: 0, sum: 0 };
  }
}

import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { FutureDateException } from './exceptions/future-date.exception';
import { AmountException } from './exceptions/amount.exception';
import { TransactionsEmptyException } from './exceptions/transactions-empty.exception';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const currentDate = new Date().toISOString();
    if (createTransactionDto.timestamp > currentDate)
      throw new FutureDateException();

    if (createTransactionDto.amount < 0) throw new AmountException();

    await this.transactionRepository.create(createTransactionDto);
  }

  async remove() {
    const transactions = await this.transactionRepository.findAll();
    if (transactions.length === 0) throw new TransactionsEmptyException();

    return await this.transactionRepository.remove();
  }
}

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  findAll(): Promise<Transaction[]>;
  create(
    createTransaction: CreateTransactionDto,
  ): Promise<CreateTransactionDto>;
  remove(): Promise<Transaction[]>;
}

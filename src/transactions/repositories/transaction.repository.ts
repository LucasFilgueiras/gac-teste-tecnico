import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { ITransactionRepository } from '../interfaces/transaction-repository.interface';

Injectable();
export class TransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      amount: createTransactionDto.amount,
      timestamp: createTransactionDto.timestamp,
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  async remove(): Promise<Transaction[]> {
    this.transactions = [];
    return this.transactions;
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions;
  }
}

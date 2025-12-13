import {
  Controller,
  Post,
  Body,
  UnprocessableEntityException,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AmountException } from './exceptions/amount.exception';
import { FutureDateException } from './exceptions/future-date.exception';
import { TransactionsEmptyException } from './exceptions/transactions-empty.exception';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionsService.create(createTransactionDto);
    } catch (error) {
      if (
        error instanceof FutureDateException ||
        error instanceof AmountException
      ) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }

  @Delete()
  async remove() {
    try {
      return await this.transactionsService.remove();
    } catch (error) {
      if (error instanceof TransactionsEmptyException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }
}

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
import { Logger } from 'winston';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionsService.create(createTransactionDto);
    } catch (error) {
      if (
        error instanceof FutureDateException ||
        error instanceof AmountException
      ) {
        this.logger.log('warn', 'Erro de validação de regra de negócio.', {
          context: 'TransactionsController',
          errorName: error.name,
          errorMessage: error.message,
          input: createTransactionDto,
        });

        throw new UnprocessableEntityException(error.message);
      }

      this.logger.error('Erro interno desconhecido no Controller.', {
        context: 'TransactionsController',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Delete()
  async remove() {
    try {
      return await this.transactionsService.remove();
    } catch (error) {
      if (error instanceof TransactionsEmptyException) {
        this.logger.log('warn', 'Erro de validação de regra de negócio.', {
          context: 'TransactionsController',
          errorName: error.name,
          errorMessage: error.message,
        });
        throw new UnprocessableEntityException(error.message);
      }

      this.logger.error('Erro interno desconhecido no Controller.', {
        context: 'TransactionsController',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

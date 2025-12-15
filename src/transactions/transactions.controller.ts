import {
  Controller,
  Post,
  Body,
  UnprocessableEntityException,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AmountException } from './exceptions/amount.exception';
import { FutureDateException } from './exceptions/future-date.exception';
import { TransactionsEmptyException } from './exceptions/transactions-empty.exception';
import { Logger } from 'winston';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Cria uma nova transação.',
    description:
      'Processa uma nova transação, validando seu timestamp e valor.',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Dados da transação a ser criada.',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados de entrada malformados (falha no class-validator).',
  })
  @ApiResponse({
    status: 422,
    description:
      'Erro de validação de negócio (Data Futura ou Valor Inválido).',
  })
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
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove todas as transações.',
    description: 'Limpa o repositório, removendo todos os dados de transações.',
  })
  @ApiResponse({
    status: 204,
    description:
      'Transações removidas com sucesso (Não há conteúdo de retorno).',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao tentar limpar o repositório.',
  })
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

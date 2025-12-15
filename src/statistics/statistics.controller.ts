import { Controller, Get, UnprocessableEntityException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TransactionsEmptyException } from '../transactions/exceptions/transactions-empty.exception';
import { Logger } from 'winston';

@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async findAll() {
    try {
      return await this.statisticsService.getStatistics();
    } catch (error) {
      if (error instanceof TransactionsEmptyException) {
        this.logger.log('warn', 'Erro de validação de regra de negócio.', {
          context: 'StatisticsController',
          errorName: error.name,
          errorMessage: error.message,
        });

        throw new UnprocessableEntityException(error.message);
      }

      this.logger.error('Erro interno desconhecido no Controller.', {
        context: 'StatisticsController',
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

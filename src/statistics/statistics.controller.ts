import { Controller, Get, UnprocessableEntityException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TransactionsEmptyException } from '../transactions/exceptions/transactions-empty.exception';
import { Logger } from 'winston';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Statistic } from './entities/statistic.entity';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(
    private readonly statisticsService: StatisticsService,
    private readonly logger: Logger,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Calcula estatísticas das transações nos últimos 60 segundos',
    description:
      'Retorna a soma, média, máximo, mínimo e contagem das transações que ocorreram no último minuto.',
  })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas calculadas com sucesso.',
    type: Statistic,
  })
  @ApiResponse({
    status: 422,
    description: 'Não há transações disponíveis.',
  })
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

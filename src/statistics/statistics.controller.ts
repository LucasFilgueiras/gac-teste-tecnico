import { Controller, Get, UnprocessableEntityException } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { TransactionsEmptyException } from 'src/transactions/exceptions/transactions-empty.exception';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async findAll() {
    try {
      return await this.statisticsService.getStatistics();
    } catch (error) {
      if (error instanceof TransactionsEmptyException) {
        throw new UnprocessableEntityException(error.message);
      }

      throw error;
    }
  }
}

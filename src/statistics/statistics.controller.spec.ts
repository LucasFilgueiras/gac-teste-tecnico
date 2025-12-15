import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TransactionsEmptyException } from '../transactions/exceptions/transactions-empty.exception';
import { Statistic } from '../statistics/entities/statistic.entity';

const mockStatisticsService = {
  getStatistics: jest.fn(),
};

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);

    jest.clearAllMocks();
  });

  describe('GET /statistics (findAll)', () => {
    const mockStatisticsResult: Statistic = {
      avg: 100.5,
      count: 5,
      max: 200,
      min: 10,
      sum: 502.5,
    };

    it('should call the service and return the object of statistics in case of success', async () => {
      mockStatisticsService.getStatistics.mockResolvedValue(
        mockStatisticsResult,
      );

      const result = await controller.findAll();

      expect(mockStatisticsService.getStatistics).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockStatisticsResult);
    });

    it('should translate TransactionsEmptyException (Service) to UnprocessableEntityException (422)', async () => {
      mockStatisticsService.getStatistics.mockRejectedValue(
        new TransactionsEmptyException(),
      );

      await expect(controller.findAll()).rejects.toThrow(
        UnprocessableEntityException,
      );

      await expect(controller.findAll()).rejects.toThrow();
    });

    it('should propagate (re-lauch) unknown exceptions (ex: 500 Internal Server Error)', async () => {
      const unknownError = new Error('Erro inesperado de servidor.');
      mockStatisticsService.getStatistics.mockRejectedValue(unknownError);

      await expect(controller.findAll()).rejects.toThrow(unknownError);
    });
  });
});

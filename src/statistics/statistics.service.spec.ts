import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsService } from './statistics.service';
import { TransactionsEmptyException } from '../transactions/exceptions/transactions-empty.exception';
import { Statistic } from './entities/statistic.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionRepository } from '../transactions/repositories/transaction.repository';

const mockTransactionRepository = {
  findAll: jest.fn(),
};

const MOCK_CURRENT_DATE_MS = new Date('2025-12-14T23:50:00.000Z').getTime();

const MOCK_TIME_LIMIT_MS = MOCK_CURRENT_DATE_MS - 60000;

describe('StatisticsService', () => {
  let service: StatisticsService;
  let repository: TransactionRepository;

  const ALL_TRANSACTIONS: Transaction[] = [
    { amount: 50.0, timestamp: '2025-12-14T23:48:59.000Z' } as Transaction, // 1ms antes do limite
    { amount: 10.0, timestamp: '2025-12-14T23:49:01.000Z' } as Transaction, // 1s após o limite
    { amount: 500.0, timestamp: '2025-12-14T23:49:30.000Z' } as Transaction,
    { amount: -50.0, timestamp: '2025-12-14T23:49:50.000Z' } as Transaction,
    { amount: 1000.0, timestamp: '2025-12-14T23:40:00.000Z' } as Transaction,
  ];

  const EXPECTED_FILTERED_AMOUNT = [10.0, 500.0, -50.0];
  const EXPECTED_COUNT = 3;
  const EXPECTED_SUM = 10.0 + 500.0 - 50.0; // 460.0
  const EXPECTED_MIN = -50.0;
  const EXPECTED_MAX = 500.0;
  const EXPECTED_AVG = EXPECTED_SUM / EXPECTED_COUNT; // 153.333...

  beforeEach(async () => {
    jest.spyOn(Date, 'now').mockReturnValue(MOCK_CURRENT_DATE_MS);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    repository = module.get<TransactionRepository>(TransactionRepository);

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('getStatistics', () => {
    it('should call the repository and calculate the statistics correctly', async () => {
      mockTransactionRepository.findAll.mockResolvedValue(ALL_TRANSACTIONS);

      const result = await service.getStatistics();

      expect(repository.findAll).toHaveBeenCalledTimes(1);

      expect(result.count).toBe(EXPECTED_COUNT);
      expect(result.sum).toBe(EXPECTED_SUM);
      expect(result.max).toBe(EXPECTED_MAX);
      expect(result.min).toBe(EXPECTED_MIN);
      expect(result.avg).toBeCloseTo(EXPECTED_AVG);
    });

    it('should trigger TransactionsEmptyException if none transaction was finded on findAll', async () => {
      mockTransactionRepository.findAll.mockResolvedValue([]);

      await expect(service.getStatistics()).rejects.toThrow(
        TransactionsEmptyException,
      );
      expect(service['calculateStatistics']).toBeUndefined;
    });

    it('should return empty statistics if had old transactions, but none is the last 60 seconds', async () => {
      const oldTransactions = ALL_TRANSACTIONS.filter(
        (t) => new Date(t.timestamp).getTime() < MOCK_TIME_LIMIT_MS,
      );
      mockTransactionRepository.findAll.mockResolvedValue(oldTransactions);

      const result = await service.getStatistics();
      const expectedEmptyStats: Statistic = {
        avg: 0,
        count: 0,
        max: 0,
        min: 0,
        sum: 0,
      };

      expect(result).toEqual(expectedEmptyStats);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate statistics correctly to a array pre-filtered', () => {
      const transactions = [
        { amount: 100 },
        { amount: 200 },
        { amount: 0 },
        { amount: -50 },
      ] as Transaction[];

      // @ts-ignore: Acessando método privado para teste de unidade pura
      const result = service['calculateStatistics'](transactions);

      expect(result.count).toBe(4);
      expect(result.sum).toBe(250); // 100 + 200 + 0 - 50
      expect(result.max).toBe(200);
      expect(result.min).toBe(-50);
      expect(result.avg).toBe(62.5); // 250 / 4
    });
  });

  describe('getEmptyStatistics', () => {
    it('should return the object of empty statistics', () => {
      // @ts-ignore: Acessando método privado para teste de unidade pura
      const result = service['getEmptyStatistics']();
      expect(result).toEqual({ avg: 0, count: 0, max: 0, min: 0, sum: 0 });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { FutureDateException } from './exceptions/future-date.exception';
import { AmountException } from './exceptions/amount.exception';
import { TransactionsEmptyException } from './exceptions/transactions-empty.exception';
import { CreateTransactionDto } from './dto/create-transaction.dto';

const mockTransactionRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: TransactionRepository;

  const MOCK_CURRENT_DATE = '2025-12-14T12:00:00.000Z';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<TransactionRepository>(TransactionRepository);

    jest.clearAllMocks();

    jest
      .spyOn(Date.prototype, 'toISOString')
      .mockReturnValue(MOCK_CURRENT_DATE);
  });

  describe('create', () => {
    const validDto: CreateTransactionDto = {
      amount: 100,
      timestamp: '2025-12-14T10:00:00.000Z',
    };

    it('should call the repository and create the transaction in a success case', async () => {
      mockTransactionRepository.create.mockResolvedValue(validDto);

      await service.create(validDto);

      expect(mockTransactionRepository.create).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.create).toHaveBeenCalledWith(validDto);
    });

    it('should trigger FutureDateException if timestamp is future', async () => {
      const futureDto: CreateTransactionDto = {
        amount: 50,
        timestamp: '2025-12-14T13:00:00.000Z',
      };

      await expect(service.create(futureDto)).rejects.toThrow(
        FutureDateException,
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });

    it('should trigger AmountException if amount is negative', async () => {
      const negativeAmountDto: CreateTransactionDto = {
        amount: -10,
        timestamp: '2025-12-14T10:00:00.000Z',
      };

      await expect(service.create(negativeAmountDto)).rejects.toThrow(
        AmountException,
      );

      expect(mockTransactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should call the repository to remove the transactions if have data', async () => {
      mockTransactionRepository.findAll.mockResolvedValue([
        { id: 1, amount: 100, timestamp: '2025-01-01' },
      ]);
      mockTransactionRepository.remove.mockResolvedValue(undefined);

      await service.remove();

      expect(mockTransactionRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.remove).toHaveBeenCalledTimes(1);
    });

    it('deve lançar TransactionsEmptyException se não houverem transações', async () => {
      mockTransactionRepository.findAll.mockResolvedValue([]);

      await expect(service.remove()).rejects.toThrow(
        TransactionsEmptyException,
      );

      expect(mockTransactionRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockTransactionRepository.remove).not.toHaveBeenCalled();
    });
  });
});

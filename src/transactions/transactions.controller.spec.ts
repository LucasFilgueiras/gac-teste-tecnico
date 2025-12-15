import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AmountException } from './exceptions/amount.exception';
import { FutureDateException } from './exceptions/future-date.exception';
import { TransactionsEmptyException } from './exceptions/transactions-empty.exception';

const mockTransactionsService = {
  create: jest.fn(),
  remove: jest.fn(),
};

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  describe('POST /transactions (create)', () => {
    const createDto: CreateTransactionDto = {
      amount: 100,
      timestamp: new Date().toISOString(),
    };
    const expectedResult = {
      ...createDto,
      id: 1,
    };

    it('should call the service and return the transaction creates in case of success', async () => {
      mockTransactionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(mockTransactionsService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });

    it('should translate FutureDateException (Service) to UnprocessableEntityException (422)', async () => {
      mockTransactionsService.create.mockRejectedValue(
        new FutureDateException(),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(controller.create(createDto)).rejects.toThrow(
        'A transação não pode ser registrada em uma data futura!',
      );
    });

    it('should translate AmountException (Service) to UnprocessableEntityException (422)', async () => {
      mockTransactionsService.create.mockRejectedValue(new AmountException());

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('should propagate (re-launch) exceptions unknowns (ex: 500)', async () => {
      const unknownError = new Error('Erro de conexão com o banco de dados');
      mockTransactionsService.create.mockRejectedValue(unknownError);

      await expect(controller.create(createDto)).rejects.toThrow(unknownError);
    });
  });

  describe('DELETE /transactions (remove)', () => {
    it('should call the service and return the result in case of success', async () => {
      mockTransactionsService.remove.mockResolvedValue(true);

      const result = await controller.remove();

      expect(mockTransactionsService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should translate TransactionsEmptyException (Service) to UnprocessableEntityException (422)', async () => {
      mockTransactionsService.remove.mockRejectedValue(
        new TransactionsEmptyException(),
      );

      await expect(controller.remove()).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(controller.remove()).rejects.toThrow(
        'Não há transações disponíveis!',
      );
    });

    it('should propagate (re-launch) exceptions unknowns (ex: 500)', async () => {
      const unknownError = new Error('Erro interno do servidor');
      mockTransactionsService.remove.mockRejectedValue(unknownError);

      await expect(controller.remove()).rejects.toThrow(unknownError);
    });
  });
});

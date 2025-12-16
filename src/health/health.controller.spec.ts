import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService, // <--- 🎯 Adicionado
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';
import { Logger } from 'winston';
import { InternalServerErrorException } from '@nestjs/common';

const mockHealthCheckService = {
  check: jest.fn(),
};

const mockDiskHealthIndicator = {
  checkStorage: jest.fn(),
};

const mockMemoryHealthIndicator = {
  checkHeap: jest.fn(),
  checkRSS: jest.fn(),
};

const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: DiskHealthIndicator,
          useValue: mockDiskHealthIndicator,
        },
        {
          provide: MemoryHealthIndicator,
          useValue: mockMemoryHealthIndicator,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    const successResult: HealthCheckResult = {
      status: 'ok',
      info: {
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
      },
      error: {},
      details: {
        memory_heap: { status: 'up' },
        memory_rss: { status: 'up' },
      },
    };

    const failureResult: HealthCheckResult = {
      status: 'error',
      info: { memory_heap: { status: 'up' } },
      error: { memory_rss: { status: 'down', message: 'RSS limit exceeded' } },
      details: {
        memory_rss: { status: 'down', message: 'RSS limit exceeded' },
      },
    };

    it('should return OK status when all the verifications pass', async () => {
      (healthCheckService.check as jest.Mock).mockResolvedValue(successResult);

      const result = await controller.check();

      expect(result).toEqual(successResult);
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });

    it('should trigger InternalServerErrorException (503) when a verification fail', async () => {
      (healthCheckService.check as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(failureResult),
      );

      await expect(controller.check()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});

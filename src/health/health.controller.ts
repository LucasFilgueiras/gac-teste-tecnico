import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Logger } from 'winston';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private readonly logger: Logger,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Verifica o status operacional e a saúde de todos os serviços.',
    description:
      'Executa uma série de verificações de saúde (memória, disco, serviços externos, etc.) e retorna o status geral (200 para OK, 503 para Erro).',
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicação e todos os serviços estão saudáveis.',
  })
  @ApiResponse({
    status: 503,
    description:
      'Algum serviço está com falha (ex: banco de dados offline, memória alta).',
  })
  check() {
    try {
      return this.health.check([
        // Verificando o uso de memória
        () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
      ]);
    } catch (error) {
      this.logger.log('warn', 'Erro no endpoint /health.', {
        context: 'HealthController',
        errorName: error.name,
        errorMessage: error.message,
      });

      throw error;
    }
  }
}

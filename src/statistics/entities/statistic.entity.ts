import { ApiProperty } from '@nestjs/swagger';

export class Statistic {
  @ApiProperty({
    description: 'Soma total de todas as transações.',
    example: 500.25,
  })
  sum: number;

  @ApiProperty({ description: 'Média das transações.', example: 125.06 })
  avg: number;

  @ApiProperty({ description: 'Maior valor de transação.', example: 300.0 })
  max: number;

  @ApiProperty({ description: 'Menor valor de transação.', example: -50.0 })
  min: number;

  @ApiProperty({ description: 'Número total de transações.', example: 4 })
  count: number;
}

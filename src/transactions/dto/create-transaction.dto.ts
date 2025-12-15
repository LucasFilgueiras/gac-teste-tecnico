import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Valor da transação.',
    example: 12.5,
    minimum: 0.01,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Data e hora da transação (ISO 8601).',
    example: '2025-12-14T23:00:00.000Z',
  })
  @IsString()
  timestamp: string;
}

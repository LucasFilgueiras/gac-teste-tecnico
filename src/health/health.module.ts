import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { Logger } from 'winston';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [Logger],
})
export class HealthModule {}

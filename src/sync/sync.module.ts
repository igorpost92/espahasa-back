import { Module } from '@nestjs/common';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Envelope } from './envelope.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Envelope])],
  controllers: [SyncController],
})
export class SyncModule {}

import { Module } from '@nestjs/common';
import { VerbsController } from './verbs.controller';
import { VerbsService } from './verbs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verb } from './verb.entity';
import { WordsModule } from '../words/words.module';
import { VerbsGrabberService } from './verbs-grabber.service';

@Module({
  imports: [TypeOrmModule.forFeature([Verb]), WordsModule],
  controllers: [VerbsController],
  providers: [VerbsService, VerbsGrabberService],
})
export class VerbsModule {}

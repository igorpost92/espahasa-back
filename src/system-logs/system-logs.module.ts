import { Global, Module } from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemLog } from './system-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemLog])],
  providers: [SystemLogsService],
  exports: [SystemLogsService],
})
export class SystemLogsModule {}

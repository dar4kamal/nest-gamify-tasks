import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { NotionModule } from 'src/notion/notion.module';
import { ValidationModule } from 'src/validation/validation.module';

@Module({
  imports: [NotionModule, ValidationModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

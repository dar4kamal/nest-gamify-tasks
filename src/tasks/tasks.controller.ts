import { Controller, Get, Headers, Query } from '@nestjs/common';
import handleQuery from 'src/utils/handleQuery';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Get('/')
  async getAll(@Headers('x-user-id') userId: string, @Query() query) {
    const { sortParams, filters } = handleQuery(query);
    return await this.taskService.getAll(userId, filters, sortParams);
  }
}

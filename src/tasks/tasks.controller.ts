import {
  Put,
  Get,
  Post,
  Body,
  Query,
  Param,
  Headers,
  Controller,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import handleQuery from 'src/utils/handleQuery';
import parseErrors from 'src/utils/parseErrors';
import { NotionService } from 'src/notion/notion.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    private readonly notionService: NotionService,
  ) {}

  @Get('/')
  async getAll(@Headers('x-user-id') userId: string, @Query() query) {
    const { sortParams, filters } = handleQuery(query);
    return await this.taskService.getAll(userId, filters, sortParams);
  }

  @Post('/')
  async add(
    @Body('name') name: string,
    @Body('points') points: number,
    @Body('userId') userId: string,
    @Body('goalId') goalId: string,
  ) {
    return await this.taskService.addTask(name, points, userId, goalId);
  }

  @Put(':taskId')
  async update(
    @Param('taskId') taskId: string,
    @Body('name') name: string,
    @Body('points') points: number,
    @Body('userId') userId: string,
    @Body('goalId') goalId: string,
    @Body('done') done: boolean,
  ) {
    const { error } = this.notionService.checkId(taskId, 'taskId');
    if (error) throw new BadRequestException({ errors: parseErrors(error) });

    return await this.taskService.updateTask(
      taskId,
      name,
      points,
      userId,
      goalId,
      done,
    );
  }
}

import {
  Put,
  Get,
  Post,
  Body,
  Query,
  Param,
  Delete,
  Headers,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import handleQuery from 'src/utils/handleQuery';
import { NotionService } from 'src/notion/notion.service';

@Controller('tasks')
export class TasksController {
  private readonly dbId: string = process.env.TASKS_DB_ID;
  constructor(
    private readonly taskService: TasksService,
    private readonly notionService: NotionService,
  ) {}

  @Get()
  async getAll(@Headers('x-user-id') userId: string, @Query() query: any) {
    const { sortParams, filters } = handleQuery(query);
    return await this.taskService.getAll(userId, filters, sortParams);
  }

  @Post()
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
    this.notionService.checkId(taskId, 'taskId');

    return await this.taskService.updateTask(
      taskId,
      name,
      points,
      userId,
      goalId,
      done,
    );
  }

  @Delete(':taskId')
  async remove(@Param('taskId') taskId: string) {
    try {
      this.notionService.checkId(taskId, 'taskId');
      await this.notionService.checkPageExists(taskId, false);
      await this.notionService.checkParent(taskId, this.dbId);
      return await this.taskService.removeTask(taskId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Headers,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import handleQuery from 'src/utils/handleQuery';
import { NotionService } from 'src/notion/notion.service';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalService: GoalsService,
    private readonly notionService: NotionService,
  ) {}

  @Get()
  async getAll(@Headers('x-user-id') userId: string, @Query() query: any) {
    const { sortParams, filters } = handleQuery(query);
    return await this.goalService.getAll(userId, filters, sortParams);
  }

  @Post()
  async add(@Body('name') name: string, @Body('userId') userId: string) {
    return await this.goalService.addGoal(name, userId);
  }

  @Put(':goalId')
  async update(
    @Param('goalId') goalId: string,
    @Body('name') name: string,
    @Body('taskId') taskId: string,
    @Body('done') done: boolean,
  ) {
    this.notionService.checkId(goalId, 'goalId');
    return await this.goalService.updateGoal(goalId, name, taskId, done);
  }
  @Delete(':goalId')
  async remove(@Param('goalId') goalId: string) {
    try {
      this.notionService.checkId(goalId, 'goalId');
      await this.notionService.checkPageExists(goalId, false);
      await this.notionService.checkParent(goalId, this.goalService.DB_ID);
      return await this.goalService.removeGoal(goalId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

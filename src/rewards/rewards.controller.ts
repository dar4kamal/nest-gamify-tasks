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
import handleQuery from 'src/utils/handleQuery';
import { RewardsService } from './rewards.service';
import { NotionService } from '../notion/notion.service';

@Controller('rewards')
export class RewardsController {
  constructor(
    private readonly rewardService: RewardsService,
    private readonly notionService: NotionService,
  ) {}

  @Get()
  async getAll(@Headers('x-user-id') userId: string, @Query() query: any) {
    const { sortParams, filters } = handleQuery(query);
    return await this.rewardService.getAll(userId, filters, sortParams);
  }

  @Post()
  async add(
    @Body('name') name: string,
    @Body('points') points: number,
    @Body('userId') userId: string,
  ) {
    return await this.rewardService.addReward(name, points, userId);
  }

  @Put(':rewardId')
  async update(
    @Param('rewardId') rewardId: string,
    @Body('name') name: string,
    @Body('points') points: number,
    @Body('achevied') achevied: boolean,
  ) {
    this.notionService.checkId(rewardId, 'rewardId');
    return await this.rewardService.updateReward(
      rewardId,
      name,
      points,
      achevied,
    );
  }

  @Delete(':rewardId')
  async remove(@Param('rewardId') rewardId: string) {
    try {
      this.notionService.checkId(rewardId, 'rewardId');
      await this.notionService.checkPageExists(rewardId, false);
      await this.notionService.checkParent(rewardId, this.rewardService.DB_ID);
      return await this.rewardService.removeReward(rewardId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}

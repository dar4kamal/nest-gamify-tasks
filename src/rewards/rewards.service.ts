import {
  addDate,
  addTitle,
  addNumber,
  addBoolean,
  addRelation,
} from 'src/utils/addData';
import { Reward } from './rewards.model';
import parseErrors from 'src/utils/parseErrors';
import { NotionService } from 'src/notion/notion.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation.service';
import { getDate, getTitle, getNumber, getBoolean } from 'src/utils/getData';

@Injectable()
export class RewardsService {
  public readonly DB_ID: string = process.env.REWARDS_DB_ID;
  constructor(
    private readonly notionService: NotionService,
    private readonly validationService: ValidationService,
  ) {
    this.validationService = new ValidationService();
    this.validationService.setEngine('Reward');
  }

  private getAllRewards = async (userId: string, filters: any, sorts: any) =>
    await this.notionService.query(
      this.DB_ID,
      {
        and: [
          {
            property: 'user',
            relation: {
              contains: userId,
            },
          },
          {
            property: 'removed',
            checkbox: {
              equals: false,
            },
          },
          ...filters,
        ],
      },
      sorts,
    );

  async getAll(userId: string, filters: any, sorts: any) {
    this.notionService.checkUserId(userId);
    const results = await this.getAllRewards(userId, filters, sorts);
    const rewards = results.map((reward) => reward.properties);

    const output = rewards.map((reward: Reward, index: number) => {
      return {
        id: results[index].id,
        name: getTitle(reward.name),
        winAt: getDate(reward.winAt),
        points: getNumber(reward.points),
        achevied: getBoolean(reward.achevied),
      };
    });
    return output;
  }

  async addReward(name: string, points: number, userId: string) {
    const { error } = this.validationService.engine.validate(
      { name, points, userId },
      'new',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });
    const props = {
      name: addTitle(name),
      user: addRelation(userId),
      points: addNumber(points),
    };

    const results: any = await this.notionService.create(this.DB_ID, props);
    const reward = results.properties;

    const output = {
      id: results.id,
      name: getTitle(reward.name),
      points: getNumber(reward.points),
    };
    return output;
  }

  async updateReward(
    rewardId: string,
    name: string,
    points: number,
    achevied: boolean,
  ) {
    const { error } = this.validationService.engine.validate(
      { name, points, achevied },
      'update',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });

    await this.notionService.checkPageExists(rewardId);

    const props = {
      name: name && addTitle(name),
      points: points && addNumber(points),
      achevied: achevied && addBoolean(achevied),
      winAt: achevied && addDate(new Date().toISOString()),
    };
    const results = await this.notionService.update(rewardId, props);
    const reward = results.properties;

    const output = {
      name: getTitle(reward.name),
      winAt: getDate(reward.winAt),
      points: getNumber(reward.points),
      achevied: getBoolean(reward.done),
    };
    return output;
  }

  async removeReward(goalId: string) {
    const results = await this.notionService.update(goalId, {
      removed: addBoolean(true),
    });
    const reward = results.properties;

    const output = {
      name: getTitle(reward.name),
      points: getNumber(reward.points),
      achevied: getBoolean(reward.achevied),
      winAt: getDate(reward.winAt),
      removed: getBoolean(reward.removed),
    };
    return output;
  }
}

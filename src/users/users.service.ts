import {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} from 'src/utils/getData';
import { User } from './users.model';
import { Injectable } from '@nestjs/common';
import { NotionService } from 'src/notion/notion.service';

@Injectable()
export class UsersService {
  private notionService: NotionService = new NotionService();

  async getAll() {
    const { results } = await this.notionService.notion.databases.query({
      database_id: process.env.USERS_DB_ID,
    });

    const usersData = results.map((user) => user.properties);

    const output = usersData.map((user: User, index: number) => {
      return {
        id: results[index].id,
        name: getTitle(user.name),
        goals: user.goals.relation.map((goal, index) => {
          return {
            id: goal.id,
            name: getTitle(getRollUpItem(user, 'goalsName', index)),
            createdAt: getDate(getRollUpItem(user, 'goalsCreatedAt', index)),
            done: getBoolean(getRollUpItem(user, 'goalsDone', index)),
          };
        }),
        tasks: user.tasks.relation.map((task, index) => {
          return {
            id: task.id,
            name: getTitle(getRollUpItem(user, 'tasksName', index)),
            createdAt: getDate(getRollUpItem(user, 'tasksCreatedAt', index)),
            done: getBoolean(getRollUpItem(user, 'tasksDone', index)),
            points: getNumber(getRollUpItem(user, 'tasksPoint', index)),
          };
        }),
        rewards: user.rewards.relation.map((reward, index) => {
          return {
            id: reward.id,
            name: getTitle(getRollUpItem(user, 'rewardsName', index)),
            winAt: getDate(getRollUpItem(user, 'rewardWinAt', index)),
            points: getNumber(getRollUpItem(user, 'rewardsPoint', index)),
            achevied: getBoolean(getRollUpItem(user, 'rewardsAchevied', index)),
          };
        }),
        totalPoints: getNumber(user.totalPoints),
      };
    });
    return output;
  }
}

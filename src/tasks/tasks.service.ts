import {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} from 'src/utils/getData';
import { Task } from './tasks.model';
import { NotionService } from 'src/notion/notion.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(private readonly notionService: NotionService) {}
  private checkUserId(userId: string) {
    if (!userId)
      throw new UnauthorizedException({
        input: 'userId',
        message: 'Unauthorized access, please provide a user id',
      });
  }
  private getAllTasks = async (userId: string, filters: any, sorts: any) => {
    return await this.notionService.query(
      process.env.TASKS_DB_ID,
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
  };

  async getAll(userId: string, filters: any, sorts: any) {
    this.checkUserId(userId);
    const results = await this.getAllTasks(userId, filters, sorts);
    const tasks = results.map((task) => task.properties);

    const output = tasks.map((task: Task, index) => {
      return {
        id: results[index].id,
        name: getTitle(task.name),
        goals: task.goals.relation.map((goal, index) => {
          return {
            id: goal.id,
            name: getTitle(getRollUpItem(task, 'goalsName', index)),
          };
        }),
        points: getNumber(task.points),
        done: getBoolean(task.done),
        createdAt: getDate(task.createdAt),
        doneAt: getDate(task.doneAt),
      };
    });
    return output;
  }
}

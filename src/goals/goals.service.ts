import {
  getDate,
  getTitle,
  getBoolean,
  getRollUpItem,
  getRollUpNumber,
  getRollUpArray,
} from 'src/utils/getData';
import { Goal } from './goals.model';
import parseErrors from 'src/utils/parseErrors';
import { NotionService } from 'src/notion/notion.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { addBoolean, addDate, addRelation, addTitle } from 'src/utils/addData';
import { ValidationService } from 'src/validation/validation.service';

@Injectable()
export class GoalsService {
  public readonly DB_ID: string = process.env.GOALS_DB_ID;
  constructor(
    private readonly notionService: NotionService,
    private readonly validationService: ValidationService,
  ) {
    this.validationService = new ValidationService();
    this.validationService.setEngine('Goal');
  }

  private getAllGoals = async (userId: string, filters: any, sorts: any) =>
    await this.notionService.query(
      process.env.GOALS_DB_ID,
      {
        and: [
          {
            property: 'users',
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
    const results = await this.getAllGoals(userId, filters, sorts);
    const goals = results.map((goal) => goal.properties);

    const output = goals.map((goal: Goal, index: number) => {
      const tasksCount = getRollUpNumber(goal, 'tasksCount');
      const tasksDone = getRollUpNumber(goal, 'tasksDone');
      return {
        id: results[index].id,
        name: getTitle(goal.name),
        done: getBoolean(goal.done),
        createdAt: getDate(goal.createdAt),
        doneAt: getDate(goal.doneAt),
        percent: Math.round((tasksDone / tasksCount) * 100),
        tasks: goal.tasks.relation.map((task, index) => {
          return {
            id: task.id,
            name: getTitle(getRollUpItem(goal, 'tasksName', index)),
          };
        }),
      };
    });
    return output;
  }

  async addGoal(name: string, userId: string) {
    const { error } = this.validationService.engine.validate(
      { name, userId },
      'new',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });
    const props = {
      name: addTitle(name),
      users: addRelation(userId),
      createdAt: addDate(new Date().toISOString()),
    };

    const results: any = await this.notionService.create(this.DB_ID, props);
    const goal = results.properties;

    const output = {
      id: results.id,
      name: getTitle(goal.name),
      tasks: [],
      createdAt: getDate(goal.createdAt),
    };
    return output;
  }

  async updateGoal(
    goalId: string,
    name: string,
    taskId: string,
    done: boolean,
  ) {
    const { error } = this.validationService.engine.validate(
      { name, taskId, done },
      'update',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });

    const page: any = await this.notionService.checkPageExists(goalId);
    const { properties } = page;

    const props = {
      name: name && addTitle(name),
      tasks:
        taskId &&
        (getRollUpArray(properties?.tasks).length > 0
          ? {
              relation: [...getRollUpArray(properties?.tasks), { id: taskId }],
            }
          : addRelation(taskId)),
      done: done && addBoolean(done),
      doneAt: done && addDate(new Date().toISOString()),
    };
    const results = await this.notionService.update(goalId, props);

    const goal: Goal = results.properties;

    const output = {
      name: getTitle(goal.name),
      tasks: goal.tasks.relation.map((task, index) => {
        return {
          id: task.id,
          name: getTitle(getRollUpItem(goal, 'tasksName', index)),
        };
      }),
      done: getBoolean(goal.done),
      createdAt: getDate(goal.createdAt),
      doneAt: getDate(goal.doneAt),
    };
    return output;
  }

  async removeGoal(goalId: string) {
    const results = await this.notionService.update(goalId, {
      removed: addBoolean(true),
    });

    const goal: Goal = results.properties;

    const output = {
      name: getTitle(goal.name),
      tasks: goal.tasks.relation.map((task, index) => {
        return {
          id: task.id,
          name: getTitle(getRollUpItem(goal, 'tasksName', index)),
        };
      }),
      done: getBoolean(goal.done),
      createdAt: getDate(goal.createdAt),
      doneAt: getDate(goal.doneAt),
      removed: getBoolean(goal.removed),
    };
    return output;
  }
}

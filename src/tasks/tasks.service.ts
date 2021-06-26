import {
  getDate,
  getTitle,
  getNumber,
  getBoolean,
  getRollUpItem,
} from 'src/utils/getData';
import {
  addDate,
  addTitle,
  addNumber,
  addBoolean,
  addRelation,
} from 'src/utils/addData';
import { Task } from './tasks.model';
import parseErrors from 'src/utils/parseErrors';
import { NotionService } from 'src/notion/notion.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation.service';

@Injectable()
export class TasksService {
  public readonly DB_ID: string = process.env.TASKS_DB_ID;
  constructor(
    private readonly notionService: NotionService,
    private readonly validationService: ValidationService,
  ) {
    this.validationService = new ValidationService();
    this.validationService.setEngine('Task');
  }

  private getAllTasks = async (userId: string, filters: any, sorts: any) => {
    return await this.notionService.query(
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
  };

  async getAll(userId: string, filters: any, sorts: any) {
    this.notionService.checkUserId(userId);
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

  async addTask(name: string, points: number, userId: string, goalId: string) {
    const { error } = this.validationService.engine.validate(
      { name, points, userId, goalId },
      'new',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });
    const props = {
      name: addTitle(name),
      points: addNumber(points),
      user: addRelation(userId),
      goals: addRelation(goalId),
      createdAt: addDate(new Date().toISOString()),
    };

    const results: any = await this.notionService.create(this.DB_ID, props);
    const task: Task = results.properties;

    const output = {
      id: results.id,
      name: getTitle(task.name),
      goals: task.goals.relation.map((goal: any, index) => {
        return {
          id: goal.id,
          name: getTitle(getRollUpItem(task, 'goalsName', index)),
        };
      }),
      points: getNumber(task.points),
      done: getBoolean(task.done),
      createdAt: getDate(task.createdAt),
    };
    return output;
  }

  async updateTask(
    taskId: string,
    name: string,
    points: number,
    userId: string,
    goalId: string,
    done: boolean,
  ) {
    const { error } = this.validationService.engine.validate(
      { name, points, userId, goalId, done },
      'update',
    );
    if (error) throw new BadRequestException({ errors: parseErrors(error) });

    await this.notionService.checkPageExists(taskId);

    const props = {
      name: name && addTitle(name),
      points: points && addNumber(points),
      user: userId && addRelation(userId),
      goals: goalId && addRelation(goalId),
      done: done && addBoolean(done),
      doneAt: done && addDate(new Date().toISOString()),
    };
    const results = await this.notionService.update(taskId, props);

    const newTask: Task = results.properties;

    const output = {
      name: getTitle(newTask.name),
      goals: newTask.goals.relation.map((goal, index) => {
        return {
          id: goal.id,
          name: getTitle(getRollUpItem(newTask, 'goalsName', index)),
        };
      }),
      points: getNumber(newTask.points),
      done: getBoolean(newTask.done),
      createdAt: getDate(newTask.createdAt),
      doneAt: getDate(newTask.doneAt),
    };
    return output;
  }

  async removeTask(taskId: string) {
    const results = await this.notionService.update(taskId, {
      removed: addBoolean(true),
    });

    const task: any = results.properties;

    const output = {
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
      removed: getBoolean(task.removed),
    };
    return output;
  }
}

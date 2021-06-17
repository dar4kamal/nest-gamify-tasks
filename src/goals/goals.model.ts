import { Task } from 'src/tasks/tasks.model';

export class Goal {
  constructor(
    public id: string,
    public name: string,
    public done: boolean,
    public createdAt: Date,
    public doneAt: Date,
    public percent: number,
    public tasks: Task[],
  ) {}
}

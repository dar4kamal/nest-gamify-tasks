import { Goal } from 'src/goals/goals.model';

export class Task {
  constructor(
    public id: string,
    public name: string,
    public goals: Goal[],
    public points: number,
    public done: boolean,
    public crearedAt: Date,
    public doneAt: Date,
  ) {}
}

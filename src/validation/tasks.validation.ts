import { object, string, number, boolean } from 'joi';
import Validation from './validation.model';
interface TaskSchema {
  name?: string;
  points?: number;
  userId?: string;
  goalId?: string;
  done?: boolean;
}
export default class TaskValidation extends Validation {
  constructor() {
    super();
    this.Schema = {} as TaskSchema;
    this.newObjectSchema = object({
      name: string().min(3).max(30).required().messages(this.nameMessages),
      points: number().min(1).required().messages(this.pointsMessages),
      userId: string()
        .pattern(this.notionRegex)
        .required()
        .messages(this.notionIdMessages),
      goalId: string()
        .pattern(this.notionRegex)
        .required()
        .messages(this.notionIdMessages),
    });

    this.updateObjectSchema = object({
      name: string().min(3).max(30).messages(this.nameMessages),
      points: number().min(1).messages(this.pointsMessages),
      userId: string()
        .pattern(this.notionRegex)
        .messages(this.notionIdMessages),
      goalId: string()
        .pattern(this.notionRegex)
        .messages(this.notionIdMessages),
      done: boolean(),
    });
  }
}

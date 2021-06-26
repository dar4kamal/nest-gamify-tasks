import { object, string, boolean } from 'joi';
import Validation from './validation.model';
interface GoalSchema {
  name?: string;
  userId?: string;
  taskId?: string;
  done?: boolean;
}

export default class GoalValidation extends Validation {
  constructor() {
    super();
    this.Schema = {} as GoalSchema;
    this.newObjectSchema = object({
      name: string().min(3).max(30).required().messages(this.nameMessages),
      userId: string()
        .pattern(this.notionRegex)
        .required()
        .messages(this.notionIdMessages),
    });

    this.updateObjectSchema = object({
      name: string().min(3).max(30).messages(this.nameMessages),
      userId: string()
        .pattern(this.notionRegex)
        .messages(this.notionIdMessages),
      taskId: string()
        .pattern(this.notionRegex)
        .messages(this.notionIdMessages),
      done: boolean(),
    });
  }
}

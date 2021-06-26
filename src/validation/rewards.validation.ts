import { object, string, number, boolean } from 'joi';
import Validation from './validation.model';
interface RewardSchema {
  name?: string;
  points?: number;
  userId?: string;
  achevied?: boolean;
}

export default class RewardValidation extends Validation {
  constructor() {
    super();
    this.Schema = {} as RewardSchema;
    this.newObjectSchema = object({
      name: string().min(3).max(30).required().messages(this.nameMessages),
      points: number().min(1).required().messages(this.pointsMessages),
      userId: string()
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
      achevied: boolean(),
    });
  }
}

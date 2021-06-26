import { object, string, boolean } from 'joi';
import getErrorMessages from '../utils/getErrorMessages';
const idRegex = new RegExp(
  /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/,
);

const nameMessages = getErrorMessages('string', [
  'base',
  'empty',
  'min',
  'max',
  'required',
]);

const notionIdMessages = getErrorMessages('string', [
  'base',
  'empty',
  'pattern',
  'required',
]);
interface GoalSchema {
  name?: string;
  userId?: string;
  taskId?: string;
  done?: boolean;
}

const newGoalSchema = object({
  name: string().min(3).max(30).required().messages(nameMessages),
  userId: string().pattern(idRegex).required().messages(notionIdMessages),
});

const updateGoalSchema = object({
  name: string().min(3).max(30).messages(nameMessages),
  userId: string().pattern(idRegex).messages(notionIdMessages),
  taskId: string().pattern(idRegex).messages(notionIdMessages),
  done: boolean(),
});

const schemaValidate = (schema: any, data: GoalSchema) =>
  schema.validate(data, { abortEarly: false });

export const validate = (data: GoalSchema, mode: string) =>
  mode == 'update'
    ? schemaValidate(updateGoalSchema, data)
    : schemaValidate(newGoalSchema, data);

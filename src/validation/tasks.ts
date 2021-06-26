import { object, string, number, boolean } from 'joi';
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
const pointsMessages = getErrorMessages('number', [
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

interface TaskSchema {
  name?: string;
  points?: number;
  userId?: string;
  goalId?: string;
  done?: boolean;
}

const newTaskSchema = object({
  name: string().min(3).max(30).required().messages(nameMessages),
  points: number().min(1).required().messages(pointsMessages),
  userId: string().pattern(idRegex).required().messages(notionIdMessages),
  goalId: string().pattern(idRegex).required().messages(notionIdMessages),
});

const updateTaskSchema = object({
  name: string().min(3).max(30).messages(nameMessages),
  points: number().min(1).messages(pointsMessages),
  userId: string().pattern(idRegex).messages(notionIdMessages),
  goalId: string().pattern(idRegex).messages(notionIdMessages),
  done: boolean(),
});

const schemaValidate = (schema: any, data: TaskSchema) =>
  schema.validate(data, { abortEarly: false });

export const validate = (data: TaskSchema, mode: string) =>
  mode == 'update'
    ? schemaValidate(updateTaskSchema, data)
    : schemaValidate(newTaskSchema, data);

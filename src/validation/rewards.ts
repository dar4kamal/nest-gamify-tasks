import { object, string, number, boolean } from 'joi';
import getErrorMessages from '../utils/getErrorMessages';
const idRegex = new RegExp(
  /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/,
);

const nameMessages = getErrorMessages('string', [
  'base',
  'empty',
  'min',
  'required',
]);
const pointsMessages = getErrorMessages('number', [
  'base',
  'empty',
  'min',
  'required',
]);

const notionIdMessages = getErrorMessages('string', [
  'base',
  'empty',
  'pattern',
  'required',
]);

interface RewardSchema {
  name?: string;
  points?: number;
  userId?: string;
  achevied?: boolean;
}

const newRewardSchema = object({
  name: string().min(3).max(30).required().messages(nameMessages),
  points: number().min(1).required().messages(pointsMessages),
  userId: string().pattern(idRegex).required().messages(notionIdMessages),
});

const updateRewardSchema = object({
  name: string().min(3).max(30).messages(nameMessages),
  points: number().min(1).messages(pointsMessages),
  userId: string().pattern(idRegex).messages(notionIdMessages),
  achevied: boolean(),
});

const schemaValidate = (schema: any, data: RewardSchema) =>
  schema.validate(data, { abortEarly: false });

export const validate = (data: RewardSchema, mode: string) =>
  mode == 'update'
    ? schemaValidate(updateRewardSchema, data)
    : schemaValidate(newRewardSchema, data);

import getErrorMessages from '../utils/getErrorMessages';

export default class Validation {
  public readonly notionRegex = new RegExp(
    /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/,
  );
  public readonly nameMessages = getErrorMessages('string', [
    'base',
    'empty',
    'min',
    'max',
    'required',
  ]);
  public readonly pointsMessages = getErrorMessages('number', [
    'base',
    'empty',
    'min',
    'max',
    'required',
  ]);
  public readonly notionIdMessages = getErrorMessages('string', [
    'base',
    'empty',
    'pattern',
    'required',
  ]);
  public Schema: any;
  public newObjectSchema: any;
  public updateObjectSchema: any;
  schemaValidate(schema: any, data: any) {
    return schema.validate(data, { abortEarly: false });
  }
  validate(data: any, mode: string) {
    return mode == 'update'
      ? this.schemaValidate(this.updateObjectSchema, data)
      : this.schemaValidate(this.newObjectSchema, data);
  }
}

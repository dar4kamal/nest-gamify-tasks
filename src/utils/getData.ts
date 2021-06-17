export const getTitle = (object: any) => {
  return object?.title[0]?.plain_text;
};
export const getEmail = (object: any) => {
  return object?.email;
};
export const getText = (object: any) => {
  return object?.rich_text[0]?.plain_text;
};
export const getNumber = (object: any) => {
  return object?.number;
};
export const getDate = (object: any) => {
  return object?.date?.start === undefined
    ? null
    : new Date(object?.date?.start).toLocaleString('en-US', {
        timeZone: 'Africa/Cairo',
      });
};
export const getBoolean = (object: any) => {
  return object?.checkbox;
};

export const getRollUpItem = (
  object: any,
  propertyName: string,
  index: number,
) => {
  return object[propertyName]?.rollup?.array[index];
};

export const getRollUpArray = (object: any) => {
  return object?.relation;
};

export const getRollUpNumber = (object: any, propertyName: string) => {
  return object[propertyName]?.rollup?.number;
};

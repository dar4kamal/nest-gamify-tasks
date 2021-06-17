export const addTitle = (input: string) => {
  return {
    title: [
      {
        text: {
          content: input,
        },
      },
    ],
  };
};
export const addEmail = (input: string) => {
  return { email: input };
};
export const addText = (input: string) => {
  return {
    rich_text: [
      {
        text: {
          content: input,
        },
      },
    ],
  };
};

export const addNumber = (input: number) => {
  return { number: input };
};
export const addDate = (input: string) => {
  return { date: { start: input, end: null } };
};
export const addBoolean = (input: boolean) => {
  return { checkbox: input };
};
export const addRelation = (input: string) => {
  return { relation: [{ id: input }] };
};

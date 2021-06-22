export default (error: any): any[] => {
  const { details } = error;

  const errors = details.map((error: any) => {
    return {
      input: error.path[0],
      value: error.context.value,
      message: error.message.replace(/"/g, ''),
    };
  });
  return errors;
};

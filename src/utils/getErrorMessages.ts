export default (
  type: string,
  listings: string[] = ['base', 'empty', 'required'],
) => {
  const messages = {
    base: 'should be a type of',
    empty: 'cannot be empty',
    min: 'should have a minimum length of {#limit}',
    max: 'should only have a maximum length of {#limit}',
    required: 'is required',
    pattern:
      'must be in the pattern of xxxxxxxx(8)-xxxx(4)-xxxx(4)-xxxx(4)-xxxxxxxxxxxx(12)',
  };
  return listings.reduce(
    (acc, item) => ({
      ...acc,
      [`${type}.${item}${item == 'pattern' ? '.base' : ''}`]:
        item == 'base' ? `${messages.base} ${type}` : `${messages[`${item}`]}`,
    }),
    {},
  );
};

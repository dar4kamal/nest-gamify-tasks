const Joi = require('joi');
const idRegex = new RegExp(
  /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/,
);

export default (id: string, name: string): {} => {
  const IdSchema = Joi.object({
    [`${name}`]: Joi.string().pattern(idRegex).messages({
      'string.pattern.base':
        'must be in the pattern of xxxxxxxx(8)-xxxx(4)-xxxx(4)-xxxx(4)-xxxxxxxxxxxx(12)',
    }),
  });
  return IdSchema.validate({ [`${name}`]: id }, { abortEarly: false });
};

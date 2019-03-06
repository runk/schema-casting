'use strict';

const _ = require('lodash');
const validate = require('jsonschema').validate;

const types = {
  integer: {
    test: (val) => !isNaN(val),
    cast: (val) => parseInt(val, 10),
  },
  number: {
    test: (val) => !isNaN(val),
    cast: (val) => parseFloat(val, 10),
  },
  boolean: {
    test: _.isBoolean,
    cast: (val) => (val === 'true' || val === '1'),
  },
  array: {
    test: _.isArray,
    cast: JSON.parse,
  },
};

module.exports = (schema, input) => {
  const errors = validate(input, schema).errors;

  if (errors === null) { return input; }

  const output = _.cloneDeep(input);
  _(errors)
    .filter({ name: 'type' })
    .filter(({ argument }) => _.has(types, argument[0]))
    .forEach((error) => {
      const key = error.property.substring(9); // convert 'instance.a.b.c' into 'a.b.c'

      const type = types[error.schema.type];
      const val = type.cast(_.get(output, key));
      if (type.test(val)) {
        _.set(output, key, val);
      }
    });

  return output;
};

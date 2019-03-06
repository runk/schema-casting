"use strict";

const _ = require("lodash");
const validate = require("jsonschema").validate;

const types = {
  integer: {
    test: val => !isNaN(val),
    cast: val => parseInt(val, 10)
  },
  number: {
    test: val => !isNaN(val),
    cast: val => parseFloat(val, 10)
  },
  boolean: {
    test: _.isBoolean,
    cast: val => val === "true"
  },
  array: {
    test: _.isArray,
    cast: JSON.parse
  }
};

module.exports = (schema, input) => {
  const errors = validate(input, schema).errors;

  if (errors === null) {
    return input;
  }

  const BASE_NAME = "instance";
  const carrier = {
    [BASE_NAME]: _.cloneDeep(input)
  };

  _(errors)
    .filter({ name: "type" })
    .filter(({ argument }) => _.has(types, argument[0]))
    .forEach(error => {
      // E.g. 'instance.a.b.c'
      const key = error.property;
      const type = types[error.schema.type];

      const val = type.cast(_.get(carrier, key));
      if (type.test(val)) {
        _.set(carrier, key, val);
      }
    });

  return carrier[BASE_NAME];
};

const castingFns = {
  integer: val => parseInt(val, 10),
  number: Number,
  boolean: val => (val === 'true'),
  array: val => JSON.parse(val),
};

exports.normalise = (store, schema) => {
  const errors = exports.validate(store, schema);
  if (errors === null) { return; }

  _(errors)
    .filter({ name: 'type' })
    .filter(({ argument }) => _.has(castingFns, argument[0]))
    .forEach((error) => {
      const key = error.property.substring(9).replace(/[.]/g, ':'); // convert 'instance.a.b.c' into 'a:b:c'
      const val = castingFns[error.schema.type](store.get(key));
      store.set(key, val);
    });
};

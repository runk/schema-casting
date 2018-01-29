schema-casting [![Build Status](https://travis-ci.org/runk/schema-casting.png)](https://travis-ci.org/runk/schema-casting)
========

Tiny tool aimed to type cast raw data based on provided json schema.

## Installation

```shell
npm i schema-casting
```


## Usage

```javascript
const sc = require('schema-casting');

const schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "a": { "required": true, "type": "integer" },
    "b": { "required": true, "type": "boolean" },
    "c": { "required": true, "type": "number" },
    "d": {
      "required": true,
      "type": "object",
      "properties": {
        "e": {
          "required": true,
          "type": "number",
        }
      }
    }
  },
  "required": true,
  "additionalProperties": false
};

const input = {
  a: '1',
  b: 'true',
  c: '2.3',
  d: { e: '4.56' },
};

const output = sc(schema, input);
console.log(output);
// { a: 1, b: true, c: 2.3, d: { e: 4.56 } }
```


## License

MIT

"use strict";

const assert = require("assert").strict;
const sc = require("../lib");
const schema = require("./data/schema");

describe("schema-casting", function() {
  it("should type cast string literals to appropriate types", () => {
    const output = sc(schema, {
      a: "1",
      b: "true",
      c: "2.34",
      d: {
        e: {
          f: "5"
        }
      }
    });

    assert.deepEqual(output, {
      a: 1,
      b: true,
      c: 2.34,
      d: {
        e: {
          f: 5
        }
      }
    });
  });

  it("should ignore string literals if casting unfeasible", () => {
    const output = sc(schema, {
      a: "hello",
      b: true,
      c: "float",
      d: {
        e: {
          f: "5"
        }
      }
    });

    assert.deepEqual(output, {
      a: "hello",
      b: true,
      c: "float",
      d: {
        e: {
          f: 5
        }
      }
    });
  });

  it("should type cast constant string literals to appropriate types", () => {
    const constantSchema = {
      type: "integer"
    };
    const output = sc(constantSchema, "123");
    assert.deepEqual(output, 123);
  });

  describe("type: boolean", () => {
    const helper = (arg, expected) => {
      const output = sc(schema, { b: arg });
      assert.deepEqual(output, { b: expected });
    };

    it("true string", () => helper("true", true));
    it("false string", () => helper("false", false));
    it("generic string", () => helper("hello", false));
    it("number '1'", () => helper("1", true));
  });
});

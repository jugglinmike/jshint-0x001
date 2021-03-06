"use strict";

var TestRun = require("../../helpers/testhelper").setup.testRun;

exports.enabling = function (test) {
  TestRun(test, "Not enabled")
    .addError(1, "'object spread property' is a non-standard language feature. Enable it using the 'objspreadrest' unstable option.")
    .test("void { ...x };", { esversion: 6 });

  TestRun(test, "Not enabled")
    .addError(1, "'object rest property' is a non-standard language feature. Enable it using the 'objspreadrest' unstable option.")
    .test("({ ...x } = {});", { esversion: 6 });

  test.done();
};

exports.spread = function (test) {
  var code = [
    "var o;",
    "o = { ...o };",
    "o = { set x(_) {}, ...o, get x() {} };",
    "o = { *gen() { yield; }, ...o, [o]() {} };",
    "o = { ...o, };"
  ];

  TestRun(test, "identifier")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  code = [
    "var o;",
    "o = { ...this };",
    "o = { ...[] };",
    "o = { ...'string' };",
    "o = { ...o = {} };",
    "o = { ...() => {} };",
    "o = { ...o => {} };"
  ];

  TestRun(test, "expression")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  test.done();
};

exports.rest = function (test) {
  var code = [
    "({ ...x } = {});",
    "({ a, ...x } = {});",
    "({ a = 0, ...x } = {});",
    "({ a: A, ...x } = {});",
    "({ a: A = 0, ...x } = {});"
  ];

  TestRun(test, "identifier, final")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  code = [
    "({ ...x, } = {});",
    "({ a, ...x, b } = {});",
    "({ a = 0, ...x, b = 1 } = {});",
    "({ a: A, ...x, b: B } = {});",
    "({ a: A = 0, ...x, b: B = 0 } = {});"
  ];

  TestRun(test, "identifier, not final")
    .addError(1, "Invalid element after rest element.")
    .addError(2, "Invalid element after rest element.")
    .addError(3, "Invalid element after rest element.")
    .addError(4, "Invalid element after rest element.")
    .addError(5, "Invalid element after rest element.")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  code = [
    "({ ...[a, b, c] } = {});",
    "({ a, ...[b, c, d] } = {});",
    "({ a = 0, ...[b, c, d] } = {});",
    "({ a: A, ...[b, c, d] } = {});",
    "({ a: A = 0, ...[b, c, d] } = {});"
  ];

  TestRun(test, "nested array pattern, final")
    .addError(1, "Expected an identifier and instead saw '['.")
    .addError(2, "Expected an identifier and instead saw '['.")
    .addError(3, "Expected an identifier and instead saw '['.")
    .addError(4, "Expected an identifier and instead saw '['.")
    .addError(5, "Expected an identifier and instead saw '['.")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  code = [
    "({ ...[a, b, c], } = {});",
    "({ a, ...[b, c, d], e } = {});",
    "({ a = 0, ...[b, c, d], e = 0 } = {});",
    "({ a: A, ...[b, c, d], e: E } = {});",
    "({ a: A = 0, ...[b, c, d], e: E = 0 } = {});",
  ];

  TestRun(test, "nested array pattern, not final")
    .addError(1, "Expected an identifier and instead saw '['.")
    .addError(1, "Invalid element after rest element.")
    .addError(2, "Expected an identifier and instead saw '['.")
    .addError(2, "Invalid element after rest element.")
    .addError(3, "Expected an identifier and instead saw '['.")
    .addError(3, "Invalid element after rest element.")
    .addError(4, "Expected an identifier and instead saw '['.")
    .addError(4, "Invalid element after rest element.")
    .addError(5, "Expected an identifier and instead saw '['.")
    .addError(5, "Invalid element after rest element.")
    .test(code, { esversion: 6, unstable: { objspreadrest: true } });

  TestRun(test, "nested array pattern, empty")
    .addError(1, "Expected an identifier and instead saw '['.")
    .test("({ ...[] } = {});", { esversion: 6, unstable: { objspreadrest: true } });

  TestRun(test, "nested object pattern, empty")
    .addError(1, "Expected an identifier and instead saw '{'.")
    .test("({ ...{} } = {});", { esversion: 6, unstable: { objspreadrest: true } });

  test.done();
};

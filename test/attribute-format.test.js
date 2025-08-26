const test = require('node:test');
const assert = require('assert');
const Attribute = require('../attribute.js');

function createAttr() {
  const mqtt = { subscribe: () => {}, publish: () => {}, unsubscribe: () => {} };
  const plc = { addItems: () => {}, writeItems: () => {} };
  return new Attribute(plc, mqtt, 'attr', 'X', 'dev');
}

test('formatMessage parses boolean true/false', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('true', 'X'), [0, true]);
  assert.deepStrictEqual(attr.formatMessage('false', 'X'), [0, false]);
});

test('formatMessage rejects invalid boolean', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('foo', 'X'), [-2]);
});

test('formatMessage parses BYTE integer', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('10', 'BYTE'), [0, 10]);
});

test('formatMessage rejects invalid BYTE', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('bar', 'BYTE'), [-2]);
});

test('formatMessage parses REAL float', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('1.23', 'REAL'), [0, 1.23]);
});

test('formatMessage rejects invalid REAL', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('baz', 'REAL'), [-2]);
});

test('formatMessage returns error for unknown type', () => {
  const attr = createAttr();
  assert.deepStrictEqual(attr.formatMessage('1', 'WORD'), [-1]);
});

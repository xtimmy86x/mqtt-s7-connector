const test = require('node:test');
const assert = require('assert');
const Device = require('../device.js');

function createDevice() {
  const mqtt = { publish: () => {}, subscribe: () => {}, unsubscribe: () => {} };
  const plc = { addItems: () => {}, writeItems: () => {} };
  const config = { type: 'sensor', name: 'Dev', mqtt: 'dev', mqtt_base: 'base' };
  return new Device(plc, mqtt, config);
}

test('get_plc_address returns configured address', () => {
  const dev = createDevice();
  dev.create_attribute({ plc: 'DB1,REAL0', set_plc: 'DB1,REAL4' }, 'REAL', 'temp');
  assert.strictEqual(dev.get_plc_address('temp'), 'DB1,REAL0');
});

test('get_plc_set_address prefers set_plc when provided', () => {
  const dev = createDevice();
  dev.create_attribute({ plc: 'DB1,REAL0', set_plc: 'DB1,REAL4' }, 'REAL', 'temp');
  assert.strictEqual(dev.get_plc_set_address('temp'), 'DB1,REAL4');
});

test('get_plc_set_address falls back to plc address', () => {
  const dev = createDevice();
  dev.create_attribute('DB1,REAL8', 'REAL', 'temp');
  assert.strictEqual(dev.get_plc_set_address('temp'), 'DB1,REAL8');
});

test('getters return null for unknown attribute', () => {
  const dev = createDevice();
  assert.strictEqual(dev.get_plc_address('unknown'), null);
  assert.strictEqual(dev.get_plc_set_address('unknown'), null);
});

test('create_attribute rejects wrong type', () => {
  const dev = createDevice();
  dev.create_attribute('DB1,X0.0', 'REAL', 'flag');
  assert.strictEqual(dev.attributes.flag, undefined);
});

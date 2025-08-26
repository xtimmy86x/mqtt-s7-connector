const test = require('node:test');
const assert = require('assert');
const deviceFactory = require('../deviceFactory.js');

function createMocks() {
  return {
    mqtt: { publish: () => {}, subscribe: () => {}, unsubscribe: () => {} },
    plc: { addItems: () => {}, writeItems: () => {} }
  };
}

test('deviceFactory generates unique mqtt names', () => {
  const { mqtt, plc } = createMocks();
  const devices = {};
  const config1 = { type: 'sensor', name: 'Temp', state: { plc: 'DB1,REAL0' } };
  const dev1 = deviceFactory(devices, plc, mqtt, config1, 'base', false);
  devices[dev1.mqtt_name] = dev1;
  const config2 = { type: 'sensor', name: 'Temp', state: { plc: 'DB1,REAL4' } };
  const dev2 = deviceFactory(devices, plc, mqtt, config2, 'base', false);
  assert.strictEqual(dev2.mqtt_name, 'temp-1');
});

const test = require('node:test');
const assert = require('assert');
const Attribute = require('../attribute.js');
const deviceFactory = require('../deviceFactory.js');

// Helper mocks
function createMocks() {
  return {
    mqtt: {
      subscribe: () => {},
      publish: () => {},
      unsubscribe: () => {}
    },
    plc: {
      addItems: () => {},
      writeItems: () => {}
    }
  };
}

test('attribute publishes with retain', () => {
  const { mqtt, plc } = createMocks();
  let call;
  mqtt.publish = (topic, message, options) => {
    call = { topic, message, options };
  };
  const attr = new Attribute(plc, mqtt, 'state', 'X', 'device', true);
  attr.rec_s7_data(true);
  assert.deepStrictEqual(call, {
    topic: 'device/state',
    message: 'true',
    options: { retain: true }
  });
});

test('attribute publishes without retain', () => {
  const { mqtt, plc } = createMocks();
  let call;
  mqtt.publish = (topic, message, options) => {
    call = { topic, message, options };
  };
  const attr = new Attribute(plc, mqtt, 'state', 'X', 'device', false);
  attr.rec_s7_data(true);
  assert.deepStrictEqual(call, {
    topic: 'device/state',
    message: 'true',
    options: { retain: false }
  });
});

test('deviceFactory propagates retain flag', () => {
  const { mqtt, plc } = createMocks();
  const config = { type: 'sensor', name: 'Temp', state: { plc: 'DB1,REAL0' } };
  const devices = {};
  const dev = deviceFactory(devices, plc, mqtt, config, 'base', true);
  assert.strictEqual(dev.attributes.state.retain_messages, true);
});

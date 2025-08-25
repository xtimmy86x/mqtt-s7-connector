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

function testAttributeRetainTrue() {
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
}

function testAttributeRetainFalse() {
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
}

function testDeviceFactoryPropagation() {
  const { mqtt, plc } = createMocks();
  const config = { type: 'sensor', name: 'Temp', state: { plc: 'DB1,REAL0' } };
  const devices = {};
  const dev = deviceFactory(devices, plc, mqtt, config, 'base', true);
  assert.strictEqual(dev.attributes.state.retain_messages, true);
}

const tests = [
  ['attribute publishes with retain', testAttributeRetainTrue],
  ['attribute publishes without retain', testAttributeRetainFalse],
  ['deviceFactory propagates retain flag', testDeviceFactoryPropagation]
];

let failed = false;
for (const [name, fn] of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    failed = true;
    console.error(`✗ ${name}`);
    console.error(err);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('All tests passed');
}

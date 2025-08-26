const test = require('node:test');
const assert = require('assert');
const Module = require('module');

test('index propagates retain flag to deviceFactory', () => {
  const originalRequire = Module.prototype.require;
  const originalSetInterval = global.setInterval;
  const originalSetTimeout = global.setTimeout;
  let passedRetain;
  let initFn;

  // stubs
  Module.prototype.require = function (request) {
    switch (request) {
      case './mqtt_handler.js':
        return {
          setup: (cfg, parser, init) => { initFn = init; return { publish: () => {}, subscribe: () => {}, unsubscribe: () => {} }; },
          isConnected: () => true
        };
      case './plc.js':
        return {
          setup: (cfg, init) => { initFn = init; return { setTranslationCB: () => {} }; },
          isConnected: () => true
        };
      case './service_functions.js':
        return { debug: () => {}, error: () => {} };
      case './deviceFactory.js':
        return function (devices, plc, mqtt, cfg, base, retain) {
          passedRetain = retain;
          return { mqtt_name: 'dev', discovery_topic: '', send_discover_msg: () => {} };
        };
      case './config':
        return { mqtt: {}, plc: {}, devices: [{ type: 'sensor', name: 'Temp', state: 'DB1,X0.0' }], retain_messages: true };
      default:
        return originalRequire.apply(this, arguments);
    }
  };

  global.setInterval = () => {};
  global.setTimeout = () => {};

  require('../index.js');
  initFn();

  // restore
  Module.prototype.require = originalRequire;
  global.setInterval = originalSetInterval;
  global.setTimeout = originalSetTimeout;

  assert.strictEqual(passedRetain, true);
});

/**
 * Generated model events
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var Generated = require('./generated.model');
var GeneratedEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
GeneratedEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Generated.schema.post(e, emitEvent(event));
}

/**
 *
 * @param event
 * @returns {Function}
 */
function emitEvent(event) {
  return function (doc) {
    GeneratedEvents.emit(event + ':' + doc._id, doc);
    GeneratedEvents.emit(event, doc);
  };
}

exports['default'] = GeneratedEvents;
module.exports = exports['default'];
//# sourceMappingURL=generated.events.js.map

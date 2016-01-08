/**
 * User model events
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var UserEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
UserEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _userModel2['default'].schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    UserEvents.emit(event + ':' + doc._id, doc);
    UserEvents.emit(event, doc);
  };
}

exports['default'] = UserEvents;
module.exports = exports['default'];
//# sourceMappingURL=user.events.js.map

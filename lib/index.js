'use strict';

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _thunk = require('./thunk');

var _thunk2 = _interopRequireDefault(_thunk);

var _actionCreators = require('./action-creators');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  entities: _reducer2.default,
  loadEntity: _thunk2.default,
  resetEntity: _actionCreators2.default.resetEntity,
  deleteEntity: _actionCreators2.default.deleteEntity
};
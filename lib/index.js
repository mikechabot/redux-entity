"use strict";

var _reducer = _interopRequireDefault(require("./reducer"));

var _thunk = _interopRequireDefault(require("./thunk"));

var _actionCreators = _interopRequireDefault(require("./action-creators"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  entities: _reducer.default,
  loadEntity: _thunk.default,
  resetEntity: _actionCreators.default.resetEntity,
  deleteEntity: _actionCreators.default.deleteEntity
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadEntity;

var _entityLifecycle = _interopRequireDefault(require("./common/entity-lifecycle"));

var _validateOptions = _interopRequireDefault(require("./util/validateOptions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
function loadEntity(name, promise, options) {
  if (!name || typeof name !== 'string') throw new Error('Missing required entity name');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');

  try {
    !(0, _validateOptions.default)(options);
  } catch (error) {
    throw error;
  }

  const entityLifecycle = new _entityLifecycle.default(name, options);
  return dispatch => {
    entityLifecycle.setDispatch(dispatch);
    entityLifecycle.onLoad();
    return promise.then(data => {
      entityLifecycle.onSuccess(data);
    }).catch(error => {
      entityLifecycle.onFailure(error);
    });
  };
}
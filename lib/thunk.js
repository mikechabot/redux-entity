"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadEntity;

var _entityLifecycle = _interopRequireDefault(require("./common/entity-lifecycle"));

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
  if (options && options.constructor !== Object) throw new Error('Expected options to be an object');
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
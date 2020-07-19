'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var EntityLifecycle_1 = __importDefault(require('./EntityLifecycle'));
var validator_1 = require('./util/validator');
var actions_1 = require('./actions');
/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  entityName        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
var GetEntity = function (entityName, promise, options) {
  if (!entityName || typeof entityName !== 'string') throw new Error('Missing required entityName');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');
  validator_1.validate(options);
  var lifecycle = new EntityLifecycle_1.default({ entityName: entityName, options: options });
  return function (dispatch, getState) {
    /**
     * Don't dispatch a fetch action if "GetEntity"
     * was invoked silently.
     */
    if (!lifecycle.silent) {
      var fetchAction = actions_1.fetchRequestCreator(entityName);
      dispatch(fetchAction());
    }
    return new Promise(function (resolve, reject) {
      promise
        .then(function (data) {
          return resolve(lifecycle.onSuccess(data, dispatch, getState));
        })
        .catch(function (error) {
          return reject(lifecycle.onFailure(error, dispatch, getState));
        });
    });
  };
};
exports.default = GetEntity;

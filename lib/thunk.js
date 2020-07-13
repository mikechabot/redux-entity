'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _EntityLifecycle = _interopRequireDefault(require('./EntityLifecycle'));

var _validator = require('./util/validator');

var _actions = require('./actions');

var _types = require('./types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
var GetEntity = function GetEntity(entityName, promise, options) {
  if (!entityName || typeof entityName !== 'string') throw new Error('Missing required entityName');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');
  (0, _validator.validate)(options);
  var entityLifecycle = new _EntityLifecycle.default({
    entityName: entityName,
    options: options,
  });
  return function (dispatch, getState) {
    /**
     * Don't dispatch a fetch action if "GetEntity"
     * was invoked silently.
     */
    if (!options || !options[_types.OptionKey.Silent]) {
      var fetchAction = (0, _actions.fetchRequestCreator)(entityName);
      dispatch(fetchAction());
    }

    return new Promise(function (resolve, reject) {
      promise
        .then(function (data) {
          return resolve(entityLifecycle.onSuccess(data, dispatch, getState));
        })
        .catch(function (error) {
          return reject(entityLifecycle.onFailure(error, dispatch, getState));
        });
    });
  };
};

var _default = GetEntity;
exports.default = _default;

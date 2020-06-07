'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _actions = require('./actions');

var _types = require('./types');

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ('value' in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var EntityLifecycle = /*#__PURE__*/ (function () {
  function EntityLifecycle(_ref) {
    var entityName = _ref.entityName,
      options = _ref.options;

    _classCallCheck(this, EntityLifecycle);

    this.entityName = entityName;
    this.append = (options === null || options === void 0 ? void 0 : options.append) || false;
    this.silent = (options === null || options === void 0 ? void 0 : options.silent) || false;
    this.processors = (options === null || options === void 0 ? void 0 : options.processors) || {};
  }
  /**
   * Execute if the promise resolves
   * @param data
   * @param dispatch
   * @param getState
   */

  _createClass(EntityLifecycle, [
    {
      key: 'onSuccess',
      value: function onSuccess(data, dispatch, getState) {
        /**
         * Process the "beforeSuccess" stage, which is able to mutate the response
         * from the promise, dispatch additional actions, or getState(), before
         * dispatching the success message
         */
        var dispatchedData = this.processStage(_types.ProcessorType.BEFORE_SUCCESS, data, dispatch, getState);
        /**
         * Create and dispatch the success action
         */

        var successAction = (0, _actions.fetchSuccessCreator)(this.entityName);
        dispatch(successAction(dispatchedData, Date.now(), this.append));
        /**
         * Process the "afterSuccess" stage, which is invoked after the success
         * action has been dispatched.
         */

        this.processStage(_types.ProcessorType.AFTER_SUCCESS, dispatchedData, dispatch, getState);
        /**
         * Return the mutated data
         */

        return dispatchedData;
      },
      /**
       * Execute if the promise rejects
       * @param error
       * @param dispatch
       * @param getState
       */
    },
    {
      key: 'onFailure',
      value: function onFailure(error, dispatch, getState) {
        /**
         * Process the "beforeFailure" stage, which is able to mutate the response
         * from the promise, dispatch additional actions, or getState(), before
         * dispatching the error message
         */
        var dispatchedError = this.processStage(_types.ProcessorType.BEFORE_FAILURE, error, dispatch, getState);
        /**
         * Create and dispatch the failure action
         */

        var failureAction = (0, _actions.fetchFailureCreator)(this.entityName);
        dispatch(failureAction(dispatchedError, Date.now()));
        /**
         * Process the "afterFailure" stage, which is invoked after the failure
         * action has been dispatched.
         */

        this.processStage(_types.ProcessorType.AFTER_FAILURE, dispatchedError, dispatch, getState);
        return dispatchedError;
      },
      /**
       * Process a stage of a given type
       * @param processorType
       * @param data
       * @param dispatch
       * @param getState
       */
    },
    {
      key: 'processStage',
      value: function processStage(processorType, data, dispatch, getState) {
        if (!processorType) {
          throw new Error('Missing required processorType');
        }
        /**
         * If the processor exists, execute it, and returned
         * the processed data.
         */

        var processor = this.processors[processorType];

        if (processor && typeof processor === 'function') {
          return processor(data, dispatch, getState);
        }

        return data;
      },
    },
  ]);

  return EntityLifecycle;
})();

var _default = EntityLifecycle;
exports.default = _default;

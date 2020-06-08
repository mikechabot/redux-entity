'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validate = void 0;
var types_1 = require('../types');
exports.validate = function (options) {
  if (!options) return;
  if (
    typeof options === 'string' ||
    typeof options === 'number' ||
    typeof options === 'function' ||
    Array.isArray(options)
  ) {
    throw new Error(
      'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options'
    );
  }
  var keys = Object.keys(options).forEach(function (key) {
    if (!Object.values(types_1.OptionKey).includes(key)) {
      throw new Error('Unexpected top-level option: ' + key);
    }
    var type = typeof options[key];
    var value = options[key];
    if (key === types_1.OptionKey.Append && type !== 'boolean') {
      throw new Error('Invalid type for "' + types_1.OptionKey.Append + ', expected "boolean"');
    }
    if (key === types_1.OptionKey.Silent && type !== 'boolean') {
      throw new Error('Invalid type for "' + types_1.OptionKey.Silent + ', expected "boolean"');
    }
    if (key === types_1.OptionKey.Processors) {
      if (!value || Array.isArray(value) || type !== 'object') {
        throw new Error('Invalid type for ' + types_1.OptionKey.Processors + ', expected "object"');
      }
      var processors_1 = value;
      var processorTypes = Object.keys(processors_1);
      processorTypes.forEach(function (processorType) {
        if (!Object.values(types_1.ProcessorType).includes(processorType)) {
          throw new Error('Invalid processorType: "' + processorType + '"');
        }
        var processor = processors_1[processorType];
        if (typeof processor !== 'function') {
          throw new Error('Expected function for processorType, but found "' + typeof processor + '"');
        }
      });
    }
  });
  return;
};

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.validate = void 0;

var _types = require('../types');

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

var validate = function validate(options) {
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
    if (!Object.values(_types.OptionKey).includes(key)) {
      throw new Error('Unexpected top-level option: '.concat(key));
    }

    var type = _typeof(options[key]);

    var value = options[key];

    if (key === _types.OptionKey.APPEND && type !== 'boolean') {
      throw new Error('Invalid type for "'.concat(_types.OptionKey.APPEND, ', expected "boolean"'));
    }

    if (key === _types.OptionKey.SILENT && type !== 'boolean') {
      throw new Error('Invalid type for "'.concat(_types.OptionKey.SILENT, ', expected "boolean"'));
    }

    if (key === _types.OptionKey.PROCESSORS) {
      if (!value || Array.isArray(value) || type !== 'object') {
        throw new Error('Invalid type for '.concat(_types.OptionKey.PROCESSORS, ', expected "object"'));
      }

      var processors = value;
      var processorTypes = Object.keys(processors);
      processorTypes.forEach(function (processorType) {
        if (!Object.values(_types.ProcessorType).includes(processorType)) {
          throw new Error('Invalid processorType: "'.concat(processorType, '"'));
        }

        var processor = processors[processorType];

        if (typeof processor !== 'function') {
          throw new Error('Expected function for processorType, but found "'.concat(_typeof(processor), '"'));
        }
      });
    }
  });
  return;
};

exports.validate = validate;

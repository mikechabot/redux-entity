'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = validate;

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

function validate(options) {
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

    if (key === _types.OptionKey.APPEND && type !== 'boolean') {
      throw new Error('Expected "boolean" but found "'.concat(type, '" for "').concat(key, '"'));
    }

    if (key === _types.OptionKey.SILENT && type !== 'boolean') {
      throw new Error('Expected "boolean" but found "'.concat(type, '" for "').concat(key, '"'));
    }

    if (key === _types.OptionKey.PROCESSORS) {
      if (type !== 'object' || Array.isArray(options[key]) || options[key] == null || options[key] === undefined) {
        throw new Error('Expected "boolean" but found "'.concat(_typeof(options[key]), '" for "').concat(key, '"'));
      }

      var processors = options[key];
      var processorTypes = Object.keys(processors);
      processorTypes.forEach(function (processorType) {
        if (!Object.values(_types.ProcessorType).includes(processorType)) {
          throw new Error('Unexpected processor type "'.concat(processorType, '"'));
        }

        var processor = processors[processorType];

        if (typeof processor !== 'function') {
          throw new Error(
            'Expected "function" but found "'.concat(_typeof(processor), '" for "').concat(processorType, '"')
          );
        }
      });
    }
  });
  return true;
}

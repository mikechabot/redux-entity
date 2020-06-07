'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = validate;

var _types = require('../types');

var _OPTIONS_VALIDATOR;

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

var ALLOWED_KEYS = {
  SILENT: 'silent',
  APPEND: 'append',
  PROCESSORS: 'processors',
};
var TYPE = {
  BOOL: 'boolean',
  FUNC: 'function',
  OBJ: 'object',
};
var OPTIONS_VALIDATOR =
  ((_OPTIONS_VALIDATOR = {}),
  _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.SILENT, {
    type: TYPE.BOOL,
  }),
  _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.APPEND, {
    type: TYPE.BOOL,
  }),
  _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.PROCESSORS, {
    type: TYPE.OBJ,
    shape: {
      beforeSuccess: {
        type: TYPE.FUNC,
      },
      afterSuccess: {
        type: TYPE.FUNC,
      },
      beforeFailure: {
        type: TYPE.FUNC,
      },
      afterFailure: {
        type: TYPE.FUNC,
      },
    },
  }),
  _OPTIONS_VALIDATOR);

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
    if (!(key in _types.OptionKey)) {
      throw new Error('Unexpected top-level option: '.concat(key));
    }

    var type = _typeof(options[key]);

    if (key === _types.OptionKey.APPEND && type !== 'boolean') {
      new Error('Expected "boolean" but found "'.concat(type, '" for "').concat(key, '"'));
    }

    if (key === _types.OptionKey.SILENT && type !== 'boolean') {
      new Error('Expected "boolean" but found "'.concat(type, '" for "').concat(key, '"'));
    }

    if (key === _types.OptionKey.PROCESSORS) {
      if (type !== 'object' || Array.isArray(options[key])) {
        throw new Error('Expected "boolean" but found "'.concat(_typeof(options[key]), '" for "').concat(key, '"'));
      }

      var processors = options[key];
      var processorTypes = Object.keys(processors);
      processorTypes.forEach(function (processorType) {
        if (!(processorType in _types.ProcessorType)) {
          throw new Error('Unexpected processor type "'.concat(processorType, '"'));
        }

        var processor = processors[processorType];

        if (typeof processor !== 'function') {
          throw new Error('Expected "function" but found "'.concat(_typeof(processor), '" for "processorType"'));
        }
      });
    }
  });
  return true;
}

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateOptions;

var _OPTIONS_VALIDATOR;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ALLOWED_KEYS = {
  SILENT: 'silent',
  APPEND: 'append',
  PROCESSORS: 'processors'
};
var TYPE = {
  BOOL: 'boolean',
  FUNC: 'function',
  OBJ: 'object'
};
var OPTIONS_VALIDATOR = (_OPTIONS_VALIDATOR = {}, _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.SILENT, {
  type: TYPE.BOOL
}), _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.APPEND, {
  type: TYPE.BOOL
}), _defineProperty(_OPTIONS_VALIDATOR, ALLOWED_KEYS.PROCESSORS, {
  type: TYPE.OBJ,
  shape: {
    "beforeSuccess": {
      type: TYPE.FUNC
    },
    "afterSuccess": {
      type: TYPE.FUNC
    },
    "beforeFailure": {
      type: TYPE.FUNC
    },
    "afterFailure": {
      type: TYPE.FUNC
    }
  }
}), _OPTIONS_VALIDATOR);

function validateOptions(options) {
  if (!options) {
    return true;
  }

  if (typeof options === 'string' || typeof options === 'number' || typeof options === 'function' || Array.isArray(options)) {
    throw new Error('Options must be an object. See https://github.com/mikechabot/redux-entity#configuration-options');
  }

  var keys = Object.keys(options);
  var keysLength = keys.length;

  if (keysLength === 0) {
    throw new Error('Options object is empty! If you mean to pass options, see https://github.com/mikechabot/redux-entity#configuration-options');
  }

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];

    if (!OPTIONS_VALIDATOR[key]) {
      throw new Error("Unexpected top-level option: ".concat(key));
    }

    if (_typeof(options[key]) !== OPTIONS_VALIDATOR[key].type) {
      throw new Error("Expected \"".concat(OPTIONS_VALIDATOR[key].type, "\" but found \"").concat(_typeof(options[key]), "\" for \"").concat(key, "\""));
    }

    if (keys[i] === ALLOWED_KEYS.PROCESSORS) {
      var shape = OPTIONS_VALIDATOR[keys[i]].shape;
      var optionsProcessors = options[keys[i]];
      var optionsProcessorKeys = Object.keys(optionsProcessors);
      var optionsProcessorsKeysLength = optionsProcessorKeys.length;

      for (var j = 0; j < optionsProcessorsKeysLength; j++) {
        var pKey = optionsProcessorKeys[j];

        if (!shape[pKey]) {
          throw new Error("Unexpected processor key \"".concat(pKey, "\""));
        }

        if (_typeof(optionsProcessors[pKey]) !== shape[pKey].type) {
          throw new Error("Expected \"".concat(shape[pKey].type, "\" but found \"").concat(_typeof(optionsProcessors[pKey]), "\" for \"").concat(pKey, "\""));
        }
      }
    }
  }

  return true;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validateOptions;
const ALLOWED_KEYS = {
  SILENT: 'silent',
  APPEND: 'append',
  PROCESSORS: 'processors'
};
const TYPE = {
  BOOL: 'boolean',
  FUNC: 'function',
  OBJ: 'object'
};
const OPTIONS_VALIDATOR = {
  [ALLOWED_KEYS.SILENT]: {
    type: TYPE.BOOL
  },
  [ALLOWED_KEYS.APPEND]: {
    type: TYPE.BOOL
  },
  [ALLOWED_KEYS.PROCESSORS]: {
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
  }
};

function validateOptions(options) {
  if (!options) {
    return true;
  }

  if (typeof options === 'string' || typeof options === 'number' || typeof options === 'function' || Array.isArray(options)) {
    throw new Error('Options must be an object. See https://github.com/mikechabot/redux-entity#configuration-options');
  }

  const keys = Object.keys(options);
  const keysLength = keys.length;

  if (keysLength === 0) {
    throw new Error('Options object is empty! If you mean to pass options, see https://github.com/mikechabot/redux-entity#configuration-options');
  }

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (!OPTIONS_VALIDATOR[key]) {
      throw new Error(`Unexpected top-level option: ${key}`);
    }

    if (typeof options[key] !== OPTIONS_VALIDATOR[key].type) {
      throw new Error(`Expected "${OPTIONS_VALIDATOR[key].type}" but found "${typeof options[key]}" for "${key}"`);
    }

    if (keys[i] === ALLOWED_KEYS.PROCESSORS) {
      const shape = OPTIONS_VALIDATOR[keys[i]].shape;
      const optionsProcessors = options[keys[i]];
      const optionsProcessorKeys = Object.keys(optionsProcessors);
      const optionsProcessorsKeysLength = optionsProcessorKeys.length;

      for (let j = 0; j < optionsProcessorsKeysLength; j++) {
        const pKey = optionsProcessorKeys[j];

        if (!shape[pKey]) {
          throw new Error(`Unexpected processor key "${pKey}"`);
        }

        if (typeof optionsProcessors[pKey] !== shape[pKey].type) {
          throw new Error(`Expected "${shape[pKey].type}" but found "${typeof optionsProcessors[pKey]}" for "${pKey}"`);
        }
      }
    }
  }

  return true;
}
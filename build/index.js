'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __exportStar =
  (this && this.__exportStar) ||
  function (m, exports) {
    for (var p in m) if (p !== 'default' && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var reducer_1 = require('./reducer');
Object.defineProperty(exports, 'reducer', {
  enumerable: true,
  get: function () {
    return reducer_1.default;
  },
});
var thunk_1 = require('./thunk');
Object.defineProperty(exports, 'GetEntity', {
  enumerable: true,
  get: function () {
    return thunk_1.default;
  },
});
var actions_1 = require('./actions');
Object.defineProperty(exports, 'ResetEntity', {
  enumerable: true,
  get: function () {
    return actions_1.ResetEntity;
  },
});
Object.defineProperty(exports, 'DeleteEntity', {
  enumerable: true,
  get: function () {
    return actions_1.DeleteEntity;
  },
});
__exportStar(require('./types'), exports);

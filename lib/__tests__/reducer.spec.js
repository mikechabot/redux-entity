'use strict';

var _reducer = _interopRequireDefault(require('../../src/reducer'));

var _types = require('../types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

var INITIAL_STATE = {};
describe('Reducer', function () {
  var entity;
  var lastUpdated;
  beforeAll(function () {
    entity = 'foo';
    lastUpdated = new Date();
  });
  describe('Existing State', function () {
    it('should return the initial state when "state" is undefined, and the action "type" is unknown', function () {
      var action = {
        type: 'bar',
      };
      var state = (0, _reducer.default)(undefined, action);
      expect(state).toEqual(INITIAL_STATE);
    });
    it('should return state when "state" is defined, and the action "type" is unknown', function () {
      var existingState = {
        foo: {
          isFetching: true,
        },
      };
      var action = {
        type: 'bar',
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(existingState);
    });
  });
  describe('Reset', function () {
    it('should revert the entity to the default entity state', function () {
      var existingState = _defineProperty({}, entity, {
        isFetching: true,
        data: ['bar'],
      });

      var expectedState = _defineProperty({}, entity, {
        isFetching: false,
        lastUpdated: lastUpdated,
      });

      var action = {
        entity: entity,
        type: _types.EntityActionType.RESET,
        payload: {
          lastUpdated: lastUpdated,
        },
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Delete', function () {
    it('should delete the entity from the root reducer', function () {
      var _existingState2;

      var entity2 = 'bar';
      var existingState =
        ((_existingState2 = {}),
        _defineProperty(_existingState2, entity, {
          isFetching: true,
          data: 'baz',
        }),
        _defineProperty(_existingState2, entity2, {
          isFetching: true,
          data: 123,
        }),
        _existingState2);

      var expectedState = _defineProperty({}, entity2, {
        isFetching: true,
        data: 123,
      });

      var action = {
        entity: entity,
        type: _types.EntityActionType.DELETE,
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Request', function () {
    it('should set "isFetching" to true, and null the error', function () {
      var existingState = _defineProperty({}, entity, {
        isFetching: false,
        error: new Error('Previous Failure'),
      });

      var expectedState = _defineProperty({}, entity, {
        isFetching: true,
        error: null,
      });

      var action = {
        entity: entity,
        type: _types.EntityActionType.REQUEST,
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Success', function () {
    it('should set "isFetching" to false, null the error, and set the payload', function () {
      var payload = {
        lastUpdated: lastUpdated,
        data: 123,
      };

      var existingState = _defineProperty({}, entity, {
        isFetching: true,
        error: new Error('Previous Failure'),
      });

      var expectedState = _defineProperty({}, entity, {
        isFetching: false,
        error: null,
        data: payload.data,
        lastUpdated: lastUpdated,
      });

      var action = {
        entity: entity,
        payload: payload,
        type: _types.EntityActionType.SUCCESS,
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(expectedState);
    });
    describe('Append', function () {
      it('should convert non-arrayed payload data to an array if existing data does not exist', function () {
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: {
            bar: 'baz',
          },
        };

        var existingState = _defineProperty({}, entity, {
          isFetching: true,
          error: new Error('Previous Failure'),
        });

        var expectedState = _defineProperty({}, entity, {
          isFetching: false,
          error: null,
          data: [payload.data],
          lastUpdated: lastUpdated,
        });

        var action = {
          entity: entity,
          payload: payload,
          type: _types.EntityActionType.SUCCESS,
        };
        var state = (0, _reducer.default)(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should not convert arrayed payload data if existing data does not exist', function () {
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: [
            {
              bar: 'baz',
            },
          ],
        };

        var existingState = _defineProperty({}, entity, {
          isFetching: true,
          error: new Error('Previous Failure'),
        });

        var expectedState = _defineProperty({}, entity, {
          isFetching: false,
          error: null,
          data: payload.data,
          lastUpdated: lastUpdated,
        });

        var action = {
          entity: entity,
          payload: payload,
          type: _types.EntityActionType.SUCCESS,
        };
        var state = (0, _reducer.default)(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should append arrayed payload data to the existing data array', function () {
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: [
            {
              bar: 'baz',
            },
          ],
        };

        var existingState = _defineProperty({}, entity, {
          isFetching: true,
          data: [
            {
              baz: 'qux',
            },
          ],
          error: new Error('Previous Failure'),
        });

        var expectedState = _defineProperty({}, entity, {
          isFetching: false,
          error: null,
          data: [
            {
              baz: 'qux',
            },
          ].concat(_toConsumableArray(payload.data)),
          lastUpdated: lastUpdated,
        });

        var action = {
          entity: entity,
          payload: payload,
          type: _types.EntityActionType.SUCCESS,
        };
        var state = (0, _reducer.default)(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should append non-arrayed payload data to the existing data array', function () {
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: {
            bar: 'baz',
          },
        };

        var existingState = _defineProperty({}, entity, {
          isFetching: true,
          data: [
            {
              baz: 'qux',
            },
          ],
          error: new Error('Previous Failure'),
        });

        var expectedState = _defineProperty({}, entity, {
          isFetching: false,
          error: null,
          data: [
            {
              baz: 'qux',
            },
            payload.data,
          ],
          lastUpdated: lastUpdated,
        });

        var action = {
          entity: entity,
          payload: payload,
          type: _types.EntityActionType.SUCCESS,
        };
        var state = (0, _reducer.default)(existingState, action);
        expect(state).toEqual(expectedState);
      });
    });
  });
  describe('Failure', function () {
    it('should set "isFetching" to false, null the data, and set the error', function () {
      var error = new Error('API Error');
      var payload = {
        lastUpdated: lastUpdated,
        error: error,
      };

      var existingState = _defineProperty({}, entity, {
        isFetching: true,
        data: {
          baz: 'qux',
        },
      });

      var expectedState = _defineProperty({}, entity, {
        isFetching: false,
        error: error,
        data: null,
        lastUpdated: lastUpdated,
      });

      var action = {
        entity: entity,
        payload: payload,
        type: _types.EntityActionType.FAILURE,
      };
      var state = (0, _reducer.default)(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
});

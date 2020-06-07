'use strict';

var _reducer = _interopRequireDefault(require('../../src/reducer'));

var _types = require('../types');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

var INITIAL_ENTITY_STATE = {
  data: undefined,
  lastUpdated: undefined,
  isFetching: false,
  error: undefined,
};
describe('Reducer', function () {
  describe('invoking the reducer', function () {
    describe('with an undefined state and an unmapped type', function () {
      it('should return the default state', function () {
        var state = (0, _reducer.default)(undefined, {
          type: null,
        });
        expect(state).toEqual({});
      });
    });
    describe('with a defined state and an unmapped type', function () {
      it('should return the defined state', function () {
        var state = {
          foo: 'bar',
        };
        expect(
          (0, _reducer.default)(state, {
            type: null,
          })
        ).toEqual(state);
      });
    });
    describe('with a defined action of', function () {
      var lastUpdated;
      var entity;
      var existingState;
      beforeEach(function () {
        entity = 'foo';
        lastUpdated = Date.now();
        existingState = _defineProperty({}, entity, {
          data: null,
          isFetching: false,
          error: null,
          lastUpdated: Date.now(),
        });
      });
      describe('FETCH_REQUEST', function () {
        it('should set the isFetching property to true', function () {
          var expectedState = {
            data: null,
            error: null,
            isFetching: true,
            lastUpdated: existingState[entity].lastUpdated,
          };
          var action = _types.ActionType.REQUEST; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            lastUpdated: lastUpdated,
            type: action,
          });
          expect(state).toEqual(_defineProperty({}, entity, expectedState));
        });
      });
      describe('FETCH_SUCCESS', function () {
        it('should update the data, error, isFetching and lastUpdated properties', function () {
          var data = {
            foo: 'bar',
          };
          var expectedState = {
            data: data,
            error: null,
            isFetching: false,
            lastUpdated: lastUpdated,
          };
          var action = _types.ActionType.SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            type: action,
            payload: {
              data: data,
              lastUpdated: lastUpdated,
            },
          });
          expect(state[entity]).toEqual(expectedState);
        });
        it('if append is true, then new data should be pushed onto the existing array (objects)', function () {
          existingState[entity].data = [
            {
              baz: 'bar',
            },
          ];
          var data = {
            foo: 'bar',
          };
          var expectedState = {
            data: [
              {
                baz: 'bar',
              },
              {
                foo: 'bar',
              },
            ],
            error: null,
            isFetching: false,
            lastUpdated: lastUpdated,
          };
          var action = _types.ActionType.SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            type: action,
            payload: {
              data: data,
              lastUpdated: lastUpdated,
              append: true,
            },
          });
          expect(state[entity]).toEqual(expectedState);
        });
        it('if append is true, then new data should be concatenated with the existing array (array)', function () {
          existingState[entity].data = [123, 456];
          var data = [789, 101112];
          var expectedState = {
            data: [123, 456, 789, 101112],
            error: null,
            isFetching: false,
            lastUpdated: lastUpdated,
          };
          var action = _types.ActionType.SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            type: action,
            entity: entity,
            payload: {
              data: data,
              lastUpdated: lastUpdated,
              append: true,
            },
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('FETCH_FAILURE', function () {
        it('should update the data, error, isFetching and lastUpdated properties', function () {
          var error = new Error('Something bad');
          var data = null;
          var expectedState = {
            data: data,
            error: error,
            isFetching: false,
            lastUpdated: lastUpdated,
          };
          var action = _types.ActionType.FAILURE; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            type: action,
            payload: {
              data: data,
              error: error,
              lastUpdated: lastUpdated,
            },
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', function () {
        it('should revert the entity to the default entity state', function () {
          var expectedState = _objectSpread(
            _objectSpread({}, INITIAL_ENTITY_STATE),
            {},
            {
              lastUpdated: lastUpdated,
            }
          );

          var type = _types.ActionType.RESET;
          var action = {
            entity: entity,
            payload: {
              lastUpdated: lastUpdated,
            },
            type: type,
          }; // Under test

          var state = (0, _reducer.default)(existingState, action);
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', function () {
        it('should revert the entity to the default entity state', function () {
          var action = _types.ActionType.DELETE; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            type: action,
          });
          expect(state[entity]).toEqual(undefined);
        });
      });
    });
  });
});

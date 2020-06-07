'use strict';

var _reducer = _interopRequireDefault(require('../../src/reducer'));

var _const = require('../const');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

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
          var action = _const.ACTION_TYPES.FETCH_REQUEST; // Under test

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
          var action = _const.ACTION_TYPES.FETCH_SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            data: data,
            lastUpdated: lastUpdated,
            type: action,
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
          var action = _const.ACTION_TYPES.FETCH_SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            data: data,
            lastUpdated: lastUpdated,
            type: action,
            append: true,
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
          var action = _const.ACTION_TYPES.FETCH_SUCCESS; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            data: data,
            lastUpdated: lastUpdated,
            type: action,
            append: true,
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
          var action = _const.ACTION_TYPES.FETCH_FAILURE; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            data: data,
            error: error,
            lastUpdated: lastUpdated,
            type: action,
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', function () {
        it('should revert the entity to the default entity state', function () {
          var expectedState = Object.assign({}, _const.INITIAL_ENTITY_STATE, {
            lastUpdated: lastUpdated,
          });
          var action = _const.ACTION_TYPES.RESET_ENTITY; // Under test

          var state = (0, _reducer.default)(existingState, {
            entity: entity,
            lastUpdated: lastUpdated,
            type: action,
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', function () {
        it('should revert the entity to the default entity state', function () {
          var action = _const.ACTION_TYPES.DELETE_ENTITY; // Under test

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

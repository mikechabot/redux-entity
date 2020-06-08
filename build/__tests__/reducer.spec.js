'use strict';
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var reducer_1 = __importDefault(require('../reducer'));
var types_1 = require('../types');
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
      var action = { type: 'bar' };
      var state = reducer_1.default(undefined, action);
      expect(state).toEqual(INITIAL_STATE);
    });
    it('should return state when "state" is defined, and the action "type" is unknown', function () {
      var existingState = { foo: { isFetching: true } };
      var action = { type: 'bar' };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(existingState);
    });
  });
  describe('Reset', function () {
    it('should revert the entity to the default entity state', function () {
      var _a, _b;
      var existingState = ((_a = {}), (_a[entity] = { isFetching: true, data: ['bar'] }), _a);
      var expectedState = ((_b = {}), (_b[entity] = { isFetching: false, lastUpdated: lastUpdated }), _b);
      var action = {
        entity: entity,
        type: types_1.EntityActionType.Reset,
        payload: { lastUpdated: lastUpdated },
      };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Delete', function () {
    it('should delete the entity from the root reducer', function () {
      var _a, _b;
      var entity2 = 'bar';
      var existingState =
        ((_a = {}),
        (_a[entity] = { isFetching: true, data: 'baz' }),
        (_a[entity2] = { isFetching: true, data: 123 }),
        _a);
      var expectedState = ((_b = {}), (_b[entity2] = { isFetching: true, data: 123 }), _b);
      var action = {
        entity: entity,
        type: types_1.EntityActionType.Delete,
      };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Request', function () {
    it('should set "isFetching" to true, and null the error', function () {
      var _a, _b;
      var existingState = ((_a = {}), (_a[entity] = { isFetching: false, error: new Error('Previous Failure') }), _a);
      var expectedState = ((_b = {}), (_b[entity] = { isFetching: true, error: null }), _b);
      var action = {
        entity: entity,
        type: types_1.EntityActionType.Request,
      };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
  describe('Success', function () {
    it('should set "isFetching" to false, null the error, and set the payload', function () {
      var _a, _b;
      var payload = {
        lastUpdated: lastUpdated,
        data: 123,
      };
      var existingState = ((_a = {}), (_a[entity] = { isFetching: true, error: new Error('Previous Failure') }), _a);
      var expectedState =
        ((_b = {}),
        (_b[entity] = { isFetching: false, error: null, data: payload.data, lastUpdated: lastUpdated }),
        _b);
      var action = {
        entity: entity,
        payload: payload,
        type: types_1.EntityActionType.Success,
      };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(expectedState);
    });
    describe('Append', function () {
      it('should convert non-arrayed payload data to an array if existing data does not exist', function () {
        var _a, _b;
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: { bar: 'baz' },
        };
        var existingState = ((_a = {}), (_a[entity] = { isFetching: true, error: new Error('Previous Failure') }), _a);
        var expectedState =
          ((_b = {}),
          (_b[entity] = { isFetching: false, error: null, data: [payload.data], lastUpdated: lastUpdated }),
          _b);
        var action = {
          entity: entity,
          payload: payload,
          type: types_1.EntityActionType.Success,
        };
        var state = reducer_1.default(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should not convert arrayed payload data if existing data does not exist', function () {
        var _a, _b;
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: [{ bar: 'baz' }],
        };
        var existingState = ((_a = {}), (_a[entity] = { isFetching: true, error: new Error('Previous Failure') }), _a);
        var expectedState =
          ((_b = {}),
          (_b[entity] = { isFetching: false, error: null, data: payload.data, lastUpdated: lastUpdated }),
          _b);
        var action = {
          entity: entity,
          payload: payload,
          type: types_1.EntityActionType.Success,
        };
        var state = reducer_1.default(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should append arrayed payload data to the existing data array', function () {
        var _a, _b;
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: [{ bar: 'baz' }],
        };
        var existingState =
          ((_a = {}),
          (_a[entity] = { isFetching: true, data: [{ baz: 'qux' }], error: new Error('Previous Failure') }),
          _a);
        var expectedState =
          ((_b = {}),
          (_b[entity] = {
            isFetching: false,
            error: null,
            data: __spreadArrays([{ baz: 'qux' }], payload.data),
            lastUpdated: lastUpdated,
          }),
          _b);
        var action = {
          entity: entity,
          payload: payload,
          type: types_1.EntityActionType.Success,
        };
        var state = reducer_1.default(existingState, action);
        expect(state).toEqual(expectedState);
      });
      it('should append non-arrayed payload data to the existing data array', function () {
        var _a, _b;
        var payload = {
          lastUpdated: lastUpdated,
          append: true,
          data: { bar: 'baz' },
        };
        var existingState =
          ((_a = {}),
          (_a[entity] = { isFetching: true, data: [{ baz: 'qux' }], error: new Error('Previous Failure') }),
          _a);
        var expectedState =
          ((_b = {}),
          (_b[entity] = {
            isFetching: false,
            error: null,
            data: [{ baz: 'qux' }, payload.data],
            lastUpdated: lastUpdated,
          }),
          _b);
        var action = {
          entity: entity,
          payload: payload,
          type: types_1.EntityActionType.Success,
        };
        var state = reducer_1.default(existingState, action);
        expect(state).toEqual(expectedState);
      });
    });
  });
  describe('Failure', function () {
    it('should set "isFetching" to false, null the data, and set the error', function () {
      var _a, _b;
      var error = new Error('API Error');
      var payload = {
        lastUpdated: lastUpdated,
        error: error,
      };
      var existingState = ((_a = {}), (_a[entity] = { isFetching: true, data: { baz: 'qux' } }), _a);
      var expectedState =
        ((_b = {}), (_b[entity] = { isFetching: false, error: error, data: null, lastUpdated: lastUpdated }), _b);
      var action = {
        entity: entity,
        payload: payload,
        type: types_1.EntityActionType.Failure,
      };
      var state = reducer_1.default(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
});

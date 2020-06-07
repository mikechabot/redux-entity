'use strict';

var _reduxThunk = _interopRequireDefault(require('redux-thunk'));

var _reduxMockStore = _interopRequireDefault(require('redux-mock-store'));

var _actions = require('../actions');

var _const = require('../const');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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

// Set up mock Redux store
var middlewares = [_reduxThunk.default];
var mockStore = (0, _reduxMockStore.default)(middlewares);
describe('Action Creators', function () {
  describe('Generic', function () {
    describe('invoking the makeActionCreator thunk', function () {
      var type;
      var key1;
      var key2;
      var data1;
      var data2;
      beforeEach(function () {
        type = 'FooType';
        key1 = 'key1';
        key2 = 'key2';
        data1 = 'data1';
        data2 = 'data2';
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.makeActionCreator)(type, key1, key2))).toBe('function');
      });
      it('should throw an error if a type is not passed', function () {
        expect(function () {
          (0, _actions.makeActionCreator)();
        }).toThrow('Type cannot be null/undefined');
      });
      describe('invoking the returned action creator', function () {
        it('should return an action containing the correct type and keys', function () {
          var expectedAction = {
            type: type,
            key1: data1,
            key2: data2,
          };
          expect((0, _actions.makeActionCreator)(type, key1, key2)(data1, data2)).toEqual(expectedAction);
        });
      });
    });
    describe('invoking the makeEntityActionCreator thunk', function () {
      var type;
      var entity;
      var key1;
      var key2;
      var data1;
      var data2;
      beforeEach(function () {
        type = 'FooType';
        entity = 'testModel';
        key1 = 'key1';
        key2 = 'key2';
        data1 = 'data1';
        data2 = 'data2';
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.makeEntityActionCreator)(type, entity, key1, key2))).toBe('function');
      });
      it('should throw an error if a type is not passed', function () {
        expect(function () {
          (0, _actions.makeEntityActionCreator)();
        }).toThrow('Type cannot be null/undefined');
      });
      it('should throw an error if an entity is not passed', function () {
        expect(function () {
          (0, _actions.makeEntityActionCreator)(type);
        }).toThrow('Entity cannot be null/undefined');
      });
      describe('invoking the returned action creator', function () {
        it('should return an action containing the correct type and keys', function () {
          var expectedAction = {
            type: type,
            entity: entity,
            key1: data1,
            key2: data2,
          };
          var actionCreator = (0, _actions.makeEntityActionCreator)(type, entity, key1, key2);
          expect(actionCreator(data1, data2)).toEqual(expectedAction);
        });
      });
    });
  });
  describe('API', function () {
    var store;
    var getState;
    var mockEntity;
    beforeEach(function () {
      mockEntity = 'mockEntity';
      getState = {};
      store = mockStore(getState);
    });
    describe('invoking the fetchRequest action creator', function () {
      it('should create a FETCH_REQUEST action', function () {
        var fetchRequestAction = {
          type: _const.ACTION_TYPES.FETCH_REQUEST,
          entity: mockEntity,
        }; // Under test

        store.dispatch((0, _actions.fetchRequestCreator)(mockEntity)());
        expect(store.getActions()).toEqual([fetchRequestAction]);
      });
    });
    describe('invoking the fetchSuccess action creator', function () {
      var mockData = {
        foo: 'bar',
      };
      var now = Date.now();
      it('should create a FETCH_SUCCESS action', function () {
        var fetchSuccessAction = {
          type: _const.ACTION_TYPES.FETCH_SUCCESS,
          entity: mockEntity,
          data: mockData,
          lastUpdated: now,
          append: false,
        }; // Under test

        store.dispatch((0, _actions.fetchSuccessCreator)(mockEntity)(mockData, now, false));
        expect(store.getActions()).toEqual([fetchSuccessAction]);
      });
    });
    describe('invoking the fetchFailure action creator', function () {
      var mockError = {
        foo: 'bar',
      };
      var now = Date.now();
      it('should create a FETCH_FAILURE action', function () {
        var fetchFailureAction = {
          entity: mockEntity,
          type: _const.ACTION_TYPES.FETCH_FAILURE,
          error: mockError,
          lastUpdated: now,
        }; // Under test

        store.dispatch((0, _actions.fetchFailureCreator)(mockEntity)(mockError, now));
        expect(store.getActions()).toEqual([fetchFailureAction]);
      });
    });
  });
});

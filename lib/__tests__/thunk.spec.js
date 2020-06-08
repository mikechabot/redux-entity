'use strict';

var _reduxThunk = _interopRequireDefault(require('redux-thunk'));

var _reduxMockStore = _interopRequireDefault(require('redux-mock-store'));

var _thunk = _interopRequireDefault(require('../../src/thunk'));

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

var middlewares = [_reduxThunk.default];
var mockStore = (0, _reduxMockStore.default)(middlewares);
describe('Thunk Action Creators', function () {
  var entity = 'mockEntity';
  var store;
  beforeEach(function () {
    store = mockStore({});
  });
  describe('GetEntity()', function () {
    describe('Valid Params', function () {
      it('should not throw any errors', function (done) {
        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve())).then(done);
        }).not.toThrow(Error);
      });
    });
    describe('Bad Arguments', function () {
      it('should throw an error when no arguments are passed', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch((0, _thunk.default)());
        }).toThrow('Missing required entityName');
      });
      it('should throw an error when "entityName" is null/undefined', function () {
        [null, undefined].forEach(function (val) {
          expect(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch((0, _thunk.default)(val));
          }).toThrow('Missing required entityName');
        });
      });
      it('should throw an error when "entityName" not passed a string"', function () {
        [123, {}, new Date(), []].forEach(function (val) {
          expect(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch((0, _thunk.default)(val));
          }).toThrow('Missing required entityName');
        });
      });
      it('should throw an error with an undefined data promise', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch((0, _thunk.default)(entity));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when a promise is not passed', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch((0, _thunk.default)(entity, {}));
        }).toThrow('Missing required entity promise');
      });
    });
    describe('Promise Resolution', function () {
      var data = {
        foo: 'bar',
      };
      var expectedFetch = {
        entity: entity,
        type: _types.EntityActionType.REQUEST,
      };
      var expectedSuccess = {
        entity: entity,
        type: _types.EntityActionType.SUCCESS,
        payload: {
          data: data,
          lastUpdated: undefined,
          append: false,
        },
      };
      var expectedActions = [expectedFetch, expectedSuccess];
      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', function (done) {
        var thunk = (0, _thunk.default)(entity, Promise.resolve(data));
        store.dispatch(thunk).then(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          var actions = store.getActions();
          expect(actions).toHaveLength(2);
          expectedSuccess.payload.lastUpdated = actions[1].payload.lastUpdated;
          expect(expectedActions).toEqual(actions);
          done();
        });
      });
    });
    describe('Promise Rejection', function () {
      var error = new Error('API Failure');
      var expectedRequest = {
        entity: entity,
        type: _types.EntityActionType.REQUEST,
      };
      var expectedFailure = {
        entity: entity,
        type: _types.EntityActionType.FAILURE,
        payload: {
          lastUpdated: undefined,
          error: error,
        },
      };
      var expectedActions = [expectedRequest, expectedFailure];
      it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', function (done) {
        var thunk = (0, _thunk.default)(entity, Promise.reject(error));
        store.dispatch(thunk).catch(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          var actions = store.getActions();
          expect(actions).toHaveLength(2);
          expectedFailure.payload.lastUpdated = actions[1].payload.lastUpdated;
          expect(expectedActions).toEqual(actions);
          done();
        });
      });
    });
    describe('Silent Option', function () {
      var data = {
        foo: 'bar',
      };
      var expectedSuccess = {
        entity: entity,
        type: _types.EntityActionType.SUCCESS,
        payload: {
          lastUpdated: undefined,
          data: data,
          append: false,
        },
      };
      var configOptions = {
        silent: true,
      };
      it('should not dispatch a FETCH_REQUEST action', function (done) {
        var thunk = (0, _thunk.default)(entity, Promise.resolve(data), configOptions);
        store.dispatch(thunk).then(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          var actions = store.getActions();
          expect(actions).toHaveLength(1);
          var successAction = actions[0]; // Force timestamps to match for easier assertion

          expectedSuccess.payload.lastUpdated = successAction.payload.lastUpdated; // Assert FETCH_SUCCESS was well-formed

          expect(successAction).toEqual(expectedSuccess);
          done();
        });
      });
    });
    describe('Processor Types', function () {
      describe('Processor Invocation', function () {
        it('should invoke the Success processor types', function (done) {
          var _processors;

          var beforeSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var afterSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var options = {
            processors:
              ((_processors = {}),
              _defineProperty(_processors, _types.ProcessorType.BEFORE_SUCCESS, beforeSpy),
              _defineProperty(_processors, _types.ProcessorType.AFTER_SUCCESS, afterSpy),
              _processors),
          };
          var thunk = (0, _thunk.default)(entity, Promise.resolve({}), options);
          store.dispatch(thunk).then(function () {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });
        it('should invoke the Failure processor types', function (done) {
          var _processors2;

          var beforeSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var afterSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var options = {
            processors:
              ((_processors2 = {}),
              _defineProperty(_processors2, _types.ProcessorType.BEFORE_FAILURE, beforeSpy),
              _defineProperty(_processors2, _types.ProcessorType.AFTER_FAILURE, afterSpy),
              _processors2),
          };
          var thunk = (0, _thunk.default)(entity, Promise.reject({}), options);
          store.dispatch(thunk).catch(function () {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });
        it('should invoke the Success processor types with data, dispatch, and getState', function (done) {
          var _processors3;

          var promiseData = {
            foo: 'bar',
          };
          var options = {
            processors:
              ((_processors3 = {}),
              _defineProperty(_processors3, _types.ProcessorType.BEFORE_SUCCESS, function (data, dispatch, getState) {
                expect(data).toEqual(promiseData);
                expect(_typeof(dispatch)).toEqual('function');
                expect(_typeof(getState)).toEqual('function');
                dispatch({
                  type: 'In_Before_Success',
                });
                return data;
              }),
              _defineProperty(_processors3, _types.ProcessorType.AFTER_SUCCESS, function (data, dispatch, getState) {
                expect(data).toEqual(promiseData);
                expect(_typeof(dispatch)).toEqual('function');
                expect(_typeof(getState)).toEqual('function');
                dispatch({
                  type: 'In_After_Success',
                });
              }),
              _processors3),
          };
          var thunk = (0, _thunk.default)(entity, Promise.resolve(promiseData), options);
          store.dispatch(thunk).then(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(4);
            done();
          });
        });
        it('should invoke the Failure processor types with data, dispatch, and getState', function (done) {
          var _processors4;

          var promiseError = new Error('API Error');
          var options = {
            processors:
              ((_processors4 = {}),
              _defineProperty(_processors4, _types.ProcessorType.BEFORE_FAILURE, function (error, dispatch, getState) {
                expect(error).toEqual(promiseError);
                expect(_typeof(dispatch)).toEqual('function');
                expect(_typeof(getState)).toEqual('function');
                dispatch({
                  type: 'In_Before_Failure',
                });
                return error;
              }),
              _defineProperty(_processors4, _types.ProcessorType.AFTER_FAILURE, function (error, dispatch, getState) {
                expect(error).toEqual(promiseError);
                expect(_typeof(dispatch)).toEqual('function');
                expect(_typeof(getState)).toEqual('function');
                dispatch({
                  type: 'In_After_Failure',
                });
              }),
              _processors4),
          };
          var thunk = (0, _thunk.default)(entity, Promise.reject(promiseError), options);
          store.dispatch(thunk).catch(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(4);
            done();
          });
        });
      });
      describe('BEFORE_SUCCESS', function () {
        it('should return the data as modified in the processor', function (done) {
          var data = {
            foo: 'bar',
            baz: 'qux',
          };
          var expectedArray = Object.keys(data);
          var options = {
            processors: _defineProperty({}, _types.ProcessorType.BEFORE_SUCCESS, function (data) {
              return Object.keys(data);
            }),
          };
          var thunk = (0, _thunk.default)(entity, Promise.resolve(data), options);
          store.dispatch(thunk).then(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(2);
            var success = actions[1];
            expect(success.payload.data).toEqual(expectedArray);
            done();
          });
        });
        it('should return the mutated data as modified in the processor', function (done) {
          var data = {
            foo: 'bar',
          };
          var mutatedData = {
            foo: 'foo',
            baz: 'qux',
          };
          var options = {
            processors: _defineProperty({}, _types.ProcessorType.BEFORE_SUCCESS, function (data) {
              return _objectSpread(
                _objectSpread({}, data),
                {},
                {
                  foo: 'foo',
                  baz: 'qux',
                }
              );
            }),
          };
          var thunk = (0, _thunk.default)(entity, Promise.resolve(data), options);
          store.dispatch(thunk).then(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(2);
            var success = actions[1];
            expect(success.payload.data).toEqual(mutatedData);
            done();
          });
        });
      });
      describe('BEFORE_FAILURE', function () {
        var apiError = new Error('Fake error 1');
        var newError = new Error('Fake error 2');
        it('should return a new error', function (done) {
          var options = {
            processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, function () {
              return newError;
            }),
          };
          var thunk = (0, _thunk.default)(entity, Promise.reject(apiError), options);
          store.dispatch(thunk).catch(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(2);
            var failure = actions[1];
            expect(failure.payload.error).toEqual(newError);
            done();
          });
        });
      });
    });
  });
});

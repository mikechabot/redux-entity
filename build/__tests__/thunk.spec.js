'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var redux_thunk_1 = __importDefault(require('redux-thunk'));
var redux_mock_store_1 = __importDefault(require('redux-mock-store'));
var thunk_1 = __importDefault(require('../../src/thunk'));
var types_1 = require('../types');
var middlewares = [redux_thunk_1.default];
var mockStore = redux_mock_store_1.default(middlewares);
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
          store.dispatch(thunk_1.default(entity, Promise.resolve())).then(done);
        }).not.toThrow(Error);
      });
    });
    describe('Bad Arguments', function () {
      it('should throw an error when no arguments are passed', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(thunk_1.default());
        }).toThrow('Missing required entityName');
      });
      it('should throw an error when "entityName" is null/undefined', function () {
        [null, undefined].forEach(function (val) {
          expect(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch(thunk_1.default(val));
          }).toThrow('Missing required entityName');
        });
      });
      it('should throw an error when "entityName" not passed a string"', function () {
        [123, {}, new Date(), []].forEach(function (val) {
          expect(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch(thunk_1.default(val));
          }).toThrow('Missing required entityName');
        });
      });
      it('should throw an error with an undefined data promise', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(thunk_1.default(entity));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when a promise is not passed', function () {
        expect(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(thunk_1.default(entity, {}));
        }).toThrow('Missing required entity promise');
      });
    });
    describe('Promise Resolution', function () {
      var data = { foo: 'bar' };
      var expectedFetch = { entity: entity, type: types_1.EntityActionType.Request };
      var expectedSuccess = {
        entity: entity,
        type: types_1.EntityActionType.Success,
        payload: {
          data: data,
          lastUpdated: undefined,
          append: false,
        },
      };
      var expectedActions = [expectedFetch, expectedSuccess];
      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', function (done) {
        var thunk = thunk_1.default(entity, Promise.resolve(data));
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
      var expectedRequest = { entity: entity, type: types_1.EntityActionType.Request };
      var expectedFailure = {
        entity: entity,
        type: types_1.EntityActionType.Failure,
        payload: {
          lastUpdated: undefined,
          error: error,
        },
      };
      var expectedActions = [expectedRequest, expectedFailure];
      it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', function (done) {
        var thunk = thunk_1.default(entity, Promise.reject(error));
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
      var data = { foo: 'bar' };
      var expectedSuccess = {
        entity: entity,
        type: types_1.EntityActionType.Success,
        payload: {
          lastUpdated: undefined,
          data: data,
          append: false,
        },
      };
      var configOptions = { silent: true };
      it('should not dispatch a FETCH_REQUEST action', function (done) {
        var thunk = thunk_1.default(entity, Promise.resolve(data), configOptions);
        store.dispatch(thunk).then(function () {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          var actions = store.getActions();
          expect(actions).toHaveLength(1);
          var successAction = actions[0];
          // Force timestamps to match for easier assertion
          expectedSuccess.payload.lastUpdated = successAction.payload.lastUpdated;
          // Assert FETCH_SUCCESS was well-formed
          expect(successAction).toEqual(expectedSuccess);
          done();
        });
      });
    });
    describe('Processor Types', function () {
      describe('Processor Invocation', function () {
        it('should invoke the Success processor types', function (done) {
          var _a;
          var beforeSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var afterSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeSuccess] = beforeSpy),
              (_a[types_1.ProcessorType.AfterSuccess] = afterSpy),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.resolve({}), options);
          store.dispatch(thunk).then(function () {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });
        it('should invoke the Failure processor types', function (done) {
          var _a;
          var beforeSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var afterSpy = jest.fn().mockImplementation(function () {
            return {};
          });
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeFailure] = beforeSpy),
              (_a[types_1.ProcessorType.AfterFailure] = afterSpy),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.reject({}), options);
          store.dispatch(thunk).catch(function () {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });
        it('should invoke the Success processor types with data, dispatch, and getState', function (done) {
          var _a;
          var promiseData = { foo: 'bar' };
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeSuccess] = function (data, dispatch, getState) {
                expect(data).toEqual(promiseData);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_Before_Success' });
                return data;
              }),
              (_a[types_1.ProcessorType.AfterSuccess] = function (data, dispatch, getState) {
                expect(data).toEqual(promiseData);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_After_Success' });
              }),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.resolve(promiseData), options);
          store.dispatch(thunk).then(function () {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            var actions = store.getActions();
            expect(actions).toHaveLength(4);
            done();
          });
        });
        it('should invoke the Failure processor types with data, dispatch, and getState', function (done) {
          var _a;
          var promiseError = new Error('API Error');
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeFailure] = function (error, dispatch, getState) {
                expect(error).toEqual(promiseError);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_Before_Failure' });
                return error;
              }),
              (_a[types_1.ProcessorType.AfterFailure] = function (error, dispatch, getState) {
                expect(error).toEqual(promiseError);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_After_Failure' });
              }),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.reject(promiseError), options);
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
          var _a;
          var data = { foo: 'bar', baz: 'qux' };
          var expectedArray = Object.keys(data);
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeSuccess] = function (data) {
                return Object.keys(data);
              }),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.resolve(data), options);
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
          var _a;
          var data = { foo: 'bar' };
          var mutatedData = {
            foo: 'foo',
            baz: 'qux',
          };
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeSuccess] = function (data) {
                return __assign(__assign({}, data), { foo: 'foo', baz: 'qux' });
              }),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.resolve(data), options);
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
          var _a;
          var options = {
            processors:
              ((_a = {}),
              (_a[types_1.ProcessorType.BeforeFailure] = function () {
                return newError;
              }),
              _a),
          };
          var thunk = thunk_1.default(entity, Promise.reject(apiError), options);
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

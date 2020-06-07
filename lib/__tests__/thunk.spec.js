'use strict';

var _reduxThunk = _interopRequireDefault(require('redux-thunk'));

var _reduxMockStore = _interopRequireDefault(require('redux-mock-store'));

var _thunk = _interopRequireDefault(require('../../src/thunk'));

var _const = require('../const');

var _EntityLifecycle = require('../common/EntityLifecycle');

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
describe('Thunk Action Creators', function () {
  var store;
  var entity;
  beforeEach(function () {
    entity = 'mockEntity';
    store = mockStore({});
  });
  describe('GetEntity()', function () {
    describe('Valid Params', function () {
      it('should not throw any errors', function (done) {
        expect(function () {
          store
            .dispatch(
              (0, _thunk.default)(entity, Promise.resolve(), {
                silent: true,
                append: false,
                processors: {
                  beforeSuccess: function beforeSuccess() {},
                },
              })
            )
            .then(done)
            .catch(done);
        }).not.toThrow(Error);
      });
    });
    describe('Invalid Params', function () {
      it('should throw an error when passed no arguments', function () {
        expect(function () {
          store.dispatch((0, _thunk.default)());
        }).toThrow('Missing required entity name');
      });
      it('should throw an error when entity name is null/undefined', function () {
        expect(function () {
          store.dispatch((0, _thunk.default)(null));
        }).toThrow('Missing required entity name');
        expect(function () {
          store.dispatch((0, _thunk.default)(undefined));
        }).toThrow('Missing required entity name');
      });
      it('should throw an error when entity name not passed a String', function () {
        expect(function () {
          store.dispatch((0, _thunk.default)(123));
        }).toThrow('Missing required entity name');
        expect(function () {
          store.dispatch((0, _thunk.default)({}));
        }).toThrow('Missing required entity name');
        expect(function () {
          store.dispatch((0, _thunk.default)(new Date()));
        }).toThrow('Missing required entity name');
      });
      it('should throw an error with an undefined data promise', function () {
        expect(function () {
          store.dispatch((0, _thunk.default)(entity));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when a promise is not passed', function () {
        expect(function () {
          store.dispatch((0, _thunk.default)(entity, {}));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when invalid options are passed', function () {
        var optionsMustBeAnObject =
          'Options must be an object. See https://github.com/mikechabot/redux-entity#configuration-options';
        var emptyOptionsObject = // eslint-disable-next-line max-len
          'Options object is empty! If you mean to pass options, see https://github.com/mikechabot/redux-entity#configuration-options'; // Options as a string

        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve(), 'foo'));
        }).toThrow(optionsMustBeAnObject); // Options as a number

        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve(), 123));
        }).toThrow(optionsMustBeAnObject); // Options as an array

        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve(), []));
        }).toThrow(optionsMustBeAnObject); // Options as a function

        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve(), function () {}));
        }).toThrow(optionsMustBeAnObject); // Options as an empty object

        expect(function () {
          store.dispatch((0, _thunk.default)(entity, Promise.resolve(), {}));
        }).toThrow(emptyOptionsObject); // Unexpected top-level key

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              foo: 'bar',
            })
          );
        }).toThrow('Unexpected top-level option: foo'); // Invalid type for "silent"

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              silent: 'bar',
            })
          );
        }).toThrow('Expected "boolean" but found "string" for "silent"'); // Invalid type for "append"

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              append: 'bar',
            })
          );
        }).toThrow('Expected "boolean" but found "string" for "append"'); // Invalid type for "processors"

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              processors: 'bar',
            })
          );
        }).toThrow('Expected "object" but found "string" for "processors"'); // Unexpected processor key

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              processors: {
                foo: 'bar',
              },
            })
          );
        }).toThrow('Unexpected processor key "foo"'); // Invalid subprocessor type

        expect(function () {
          store.dispatch(
            (0, _thunk.default)(entity, Promise.resolve(), {
              processors: {
                beforeSuccess: 'bar',
              },
            })
          );
        }).toThrow('Expected "function" but found "string" for "beforeSuccess"');
      });
    });
    describe('when GetEntity() succeeds', function () {
      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', function (done) {
        var data = {
          foo: 'bar',
        };
        var promise = Promise.resolve(data);
        var expectedFetch = {
          type: _const.ACTION_TYPES.FETCH_REQUEST,
          entity: entity,
        };
        var expectedSuccess = {
          type: _const.ACTION_TYPES.FETCH_SUCCESS,
          lastUpdated: undefined,
          // Overwrite this in assertion
          entity: entity,
          data: data,
          append: false,
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, promise, null))
          .then(function () {
            // Assert 2 actions were invoked
            var actions = store.getActions();
            expect(actions.length).toEqual(2); // Asset FETCH_REQUEST was well-formed

            var request = actions[0];
            expect(request).toEqual(expectedFetch); // Assert timestamp is present and valid

            var success = actions[1];
            expect(success.lastUpdated).toBeTruthy();
            expect(_typeof(success.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedSuccess.lastUpdated = success.lastUpdated; // Assert FETCH_SUCCESS was well-formed

            expect(success).toEqual(expectedSuccess);
          })
          .then(done)
          .catch(done);
      });
    });
    describe('when GetEntity() fails', function () {
      it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', function (done) {
        var error = {
          message: 'foo',
        };
        var promise = Promise.reject(error);
        var expectedRequest = {
          type: _const.ACTION_TYPES.FETCH_REQUEST,
          entity: entity,
        };
        var expectedFailure = {
          type: _const.ACTION_TYPES.FETCH_FAILURE,
          lastUpdated: undefined,
          // Overwrite this in assertion
          entity: entity,
          error: error,
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, promise, false))
          .catch(function () {
            // Assert 2 actions were invoked
            var actions = store.getActions();
            expect(actions.length).toEqual(2); // Asset FETCH_REQUEST was well-formed

            var request = actions[0];
            expect(request).toEqual(expectedRequest); // Assert timestamp is present and valid

            var failure = actions[1];
            expect(failure.lastUpdated).toBeTruthy();
            expect(_typeof(failure.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedFailure.lastUpdated = failure.lastUpdated; // Assert FETCH_FAILURE was well-formed

            expect(failure).toEqual(expectedFailure);
          })
          .catch(done)
          .then(done);
      });
    });
    describe('when GetEntity() is configured to be silent', function () {
      it('should not dispatch a FETCH_REQUEST action', function (done) {
        var data = {
          foo: 'bar',
        };
        var promise = Promise.resolve(data);
        var expectedSuccess = {
          type: _const.ACTION_TYPES.FETCH_SUCCESS,
          lastUpdated: undefined,
          // Overwrite this in assertion
          entity: entity,
          data: data,
          append: false,
        };
        var configOptions = {
          silent: true,
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, promise, configOptions))
          .then(function () {
            // Assert 1 action was invoked
            var actions = store.getActions();
            expect(actions.length).toEqual(1); // Assert timestamp is present and valid

            var success = actions[0];
            expect(success.lastUpdated).toBeTruthy();
            expect(_typeof(success.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedSuccess.lastUpdated = success.lastUpdated; // Assert FETCH_SUCCESS was well-formed

            expect(success).toEqual(expectedSuccess);
          })
          .then(done)
          .catch(done);
      });
    });
    describe('when GetEntity() is configured with stage processors', function () {
      it('Stage BEFORE_SUCCESS', function (done) {
        var spy = jest.fn().mockImplementation(function (dispatch, getState, data) {
          return dispatch({
            type: 'foo',
            data: data,
          });
        });
        var configOptions = {
          processors: _defineProperty({}, _EntityLifecycle.PROCESSOR_STAGE.BEFORE_SUCCESS, spy),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.resolve({}), configOptions))
          .then(function () {
            expect(spy).toHaveBeenCalled();
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_SUCCESS should return a new object', function (done) {
        var beforeSuccess = {
          _runBeforeSuccess: function _runBeforeSuccess(dispatch, getState, data) {
            return Object.keys(data);
          },
        };
        var configOptions = {
          processors: _defineProperty(
            {},
            _EntityLifecycle.PROCESSOR_STAGE.BEFORE_SUCCESS,
            beforeSuccess._runBeforeSuccess
          ),
        }; // Under test

        store
          .dispatch(
            (0, _thunk.default)(
              entity,
              Promise.resolve({
                foo: 'bar',
              }),
              configOptions
            )
          )
          .then(function () {
            expect(store.getActions()[1].data).toEqual(['foo']);
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_SUCCESS should mutate the existing data object', function (done) {
        var beforeSuccess = {
          _runBeforeSuccess: function _runBeforeSuccess(dispatch, getState, data) {
            data.foo = 'baz';
            return data;
          },
        };
        var configOptions = {
          processors: _defineProperty(
            {},
            _EntityLifecycle.PROCESSOR_STAGE.BEFORE_SUCCESS,
            beforeSuccess._runBeforeSuccess
          ),
        }; // Under test

        store
          .dispatch(
            (0, _thunk.default)(
              entity,
              Promise.resolve({
                foo: 'bar',
              }),
              configOptions
            )
          )
          .then(function () {
            expect(store.getActions()[1].data).toEqual({
              foo: 'baz',
            });
          })
          .then(done)
          .catch(done);
      });
      it('Stage AFTER_SUCCESS', function (done) {
        var spy = jest.fn().mockImplementation(function (dispatch, getState, data) {
          return dispatch({
            type: 'foo',
            data: data,
          });
        });
        var configOptions = {
          processors: _defineProperty({}, _EntityLifecycle.PROCESSOR_STAGE.AFTER_SUCCESS, spy),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.resolve({}), configOptions))
          .then(function () {
            expect(spy).toHaveBeenCalled();
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_FAILURE', function (done) {
        var spy = jest.fn().mockImplementation(function (dispatch, getState, data) {
          return dispatch({
            type: 'foo',
            data: data,
          });
        });
        var configOptions = {
          processors: _defineProperty({}, _EntityLifecycle.PROCESSOR_STAGE.BEFORE_FAILURE, spy),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.reject(new Error('Fake error')), configOptions))
          .catch(function () {
            expect(spy).toHaveBeenCalled();
            done();
          });
      });
      it('Stage BEFORE_FAILURE should return a new object', function (done) {
        var beforeFailure = {
          _runBeforeFailure: function _runBeforeFailure() {
            return new Error('Fake error 2');
          },
        };
        var configOptions = {
          processors: _defineProperty(
            {},
            _EntityLifecycle.PROCESSOR_STAGE.BEFORE_FAILURE,
            beforeFailure._runBeforeFailure
          ),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.reject(new Error('Fake error 1')), configOptions))
          .catch(function () {
            expect(store.getActions()[1].error).toEqual(new Error('Fake error 2'));
            done();
          });
      });
      it('Stage AFTER_FAILURE', function (done) {
        var spy = jest.fn().mockImplementation(function (dispatch, getState, data) {
          return dispatch({
            type: 'foo',
            data: data,
          });
        });
        var configOptions = {
          processors: _defineProperty({}, _EntityLifecycle.PROCESSOR_STAGE.BEFORE_FAILURE, spy),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.reject(new Error('Fake Error')), configOptions))
          .catch(function () {
            expect(spy).toHaveBeenCalled();
            done();
          });
      });
    });
  });
});

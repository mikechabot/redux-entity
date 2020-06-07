'use strict';

var _reduxThunk = _interopRequireDefault(require('redux-thunk'));

var _reduxMockStore = _interopRequireDefault(require('redux-mock-store'));

var _thunk = _interopRequireDefault(require('../../src/thunk'));

var _types = require('../types');

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
        }).toThrow('Missing required entityName');
      });
      it('should throw an error when "entityName" is null/undefined', function () {
        [null, undefined].forEach(function (val) {
          expect(function () {
            store.dispatch((0, _thunk.default)(val));
          }).toThrow('Missing required entityName');
        });
      });
      it('should throw an error when "entityName" not passed a String', function () {
        [123, {}, new Date()].forEach(function (val) {
          expect(function () {
            store.dispatch((0, _thunk.default)(val));
          }).toThrow('Missing required entityName');
        });
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
      describe('Invalid Options Params', function () {
        var optionsMustBeAnObject =
          'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options';
        it('should throw an error if "options" is a string', function () {
          expect(function () {
            store.dispatch((0, _thunk.default)(entity, Promise.resolve(), 'foo'));
          }).toThrow(optionsMustBeAnObject);
        });
        it('should throw an error if "options" is a number', function () {
          expect(function () {
            store.dispatch((0, _thunk.default)(entity, Promise.resolve(), 123));
          }).toThrow(optionsMustBeAnObject);
        });
        it('should throw an error if "options" is an array', function () {
          expect(function () {
            store.dispatch((0, _thunk.default)(entity, Promise.resolve(), []));
          }).toThrow(optionsMustBeAnObject);
        });
        it('should throw an error if "options" is a function', function () {
          expect(function () {
            store.dispatch((0, _thunk.default)(entity, Promise.resolve(), function () {}));
          }).toThrow(optionsMustBeAnObject);
        });
        it('should throw an error if an unknown key is passed in "options"', function () {
          expect(function () {
            store.dispatch(
              (0, _thunk.default)(entity, Promise.resolve(), {
                foo: 'bar',
              })
            );
          }).toThrow('Unexpected top-level option: foo');
        });
        it('should throw an error if "silent" is not a boolean', function () {
          [123, 'foo', {}, function () {}, [], null, undefined].forEach(function (val) {
            expect(function () {
              store.dispatch(
                (0, _thunk.default)(entity, Promise.resolve(), {
                  silent: val,
                })
              );
            }).toThrow('Expected "boolean" but found "'.concat(_typeof(val), '" for "silent"'));
          });
        });
        it('should throw an error if "append" is not a boolean', function () {
          [123, 'foo', {}, function () {}, [], null, undefined].forEach(function (val) {
            expect(function () {
              store.dispatch(
                (0, _thunk.default)(entity, Promise.resolve(), {
                  append: val,
                })
              );
            }).toThrow('Expected "boolean" but found "'.concat(_typeof(val), '" for "append"'));
          });
        });
        it('should throw an error if "processors" is not an object', function () {
          [123, 'foo', function () {}, [], null, undefined].forEach(function (val) {
            expect(function () {
              store.dispatch(
                (0, _thunk.default)(entity, Promise.resolve(), {
                  processors: val,
                })
              );
            }).toThrow('Expected "boolean" but found "'.concat(_typeof(val), '" for "processors"'));
          });
        });
        it('should throw an error if an unknown processor type is passed', function () {
          expect(function () {
            store.dispatch(
              (0, _thunk.default)(entity, Promise.resolve(), {
                processors: {
                  foo: 'bar',
                },
              })
            );
          }).toThrow('Unexpected processor type "foo"');
        });
        it('should throw an error if a processor is not a function', function () {
          [123, 'foo', {}, [], null, undefined].forEach(function (val) {
            expect(function () {
              store.dispatch(
                (0, _thunk.default)(entity, Promise.resolve(), {
                  processors: {
                    beforeSuccess: val,
                  },
                })
              );
            }).toThrow('Expected "function" but found "'.concat(_typeof(val), '" for "beforeSuccess"'));
          });
        });
      });
    });
    describe('when GetEntity() succeeds', function () {
      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', function (done) {
        var data = {
          foo: 'bar',
        };
        var promise = Promise.resolve(data);
        var expectedFetch = {
          type: _types.ActionType.REQUEST,
          entity: entity,
        };
        var expectedSuccess = {
          entity: entity,
          type: _types.ActionType.SUCCESS,
          payload: {
            data: data,
            lastUpdated: undefined,
            // Overwrite this in assertion
            append: false,
          },
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
            expect(success.payload.lastUpdated).toBeTruthy();
            expect(_typeof(success.payload.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedSuccess.payload.lastUpdated = success.payload.lastUpdated; // Assert FETCH_SUCCESS was well-formed

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
          type: _types.ActionType.REQUEST,
          entity: entity,
        };
        var expectedFailure = {
          entity: entity,
          type: _types.ActionType.FAILURE,
          payload: {
            lastUpdated: undefined,
            // Overwrite this in assertion
            error: error,
          },
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
            expect(failure.payload.lastUpdated).toBeTruthy();
            expect(_typeof(failure.payload.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedFailure.payload.lastUpdated = failure.payload.lastUpdated; // Assert FETCH_FAILURE was well-formed

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
          entity: entity,
          type: _types.ActionType.SUCCESS,
          payload: {
            lastUpdated: undefined,
            // Overwrite this in assertion
            data: data,
            append: false,
          },
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
            expect(success.payload.lastUpdated).toBeTruthy();
            expect(_typeof(success.payload.lastUpdated)).toBe('number'); // Force timestamps to match for easier assertion

            expectedSuccess.payload.lastUpdated = success.payload.lastUpdated; // Assert FETCH_SUCCESS was well-formed

            expect(success).toEqual(expectedSuccess);
          })
          .then(done)
          .catch(done);
      });
    });
    describe('when GetEntity() is configured with stage processors', function () {
      it('Stage BEFORE_SUCCESS', function (done) {
        var spy = jest.fn().mockImplementation(function () {
          return function () {
            return {
              type: 'foo',
              data: data,
            };
          };
        });
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_SUCCESS, spy),
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
          _runBeforeSuccess: function _runBeforeSuccess(data, dispatch, getState) {
            return Object.keys(data);
          },
        };
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_SUCCESS, beforeSuccess._runBeforeSuccess),
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
            var success = store.getActions()[1];
            expect(success.payload.data).toEqual(['foo']);
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_SUCCESS should mutate the existing data object', function (done) {
        var beforeSuccess = {
          _runBeforeSuccess: function _runBeforeSuccess(data, dispatch, getState) {
            data.foo = 'baz';
            return data;
          },
        };
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_SUCCESS, beforeSuccess._runBeforeSuccess),
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
            var success = store.getActions()[1];
            expect(success.payload.data).toEqual({
              foo: 'baz',
            });
          })
          .then(done)
          .catch(done);
      });
      it('Stage AFTER_SUCCESS', function (done) {
        var spy = jest.fn().mockImplementation(function () {
          return function () {
            return {
              type: 'foo',
              data: data,
            };
          };
        });
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.AFTER_SUCCESS, spy),
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
        var spy = jest.fn().mockImplementation(function () {
          return function () {
            return {
              type: 'foo',
              data: data,
            };
          };
        });
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, spy),
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
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, beforeFailure._runBeforeFailure),
        }; // Under test

        store
          .dispatch((0, _thunk.default)(entity, Promise.reject(new Error('Fake error 1')), configOptions))
          .catch(function () {
            var failure = store.getActions()[1];
            expect(failure.payload.error).toEqual(new Error('Fake error 2'));
            done();
          });
      });
      it('Stage AFTER_FAILURE', function (done) {
        var spy = jest.fn().mockImplementation(function () {
          return function () {
            return {
              type: 'foo',
              data: data,
            };
          };
        });
        var configOptions = {
          processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, spy),
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

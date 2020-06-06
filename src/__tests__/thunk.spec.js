import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import loadEntity from '../../src/thunk';
import { ACTION_TYPES } from '../const';
import { PROCESSOR_STAGE } from '../common/EntityLifecycle';

// Set up mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Thunk Action Creators', () => {
  let store;
  let entity;
  beforeEach(() => {
    entity = 'mockEntity';
    store = mockStore({});
  });

  describe('loadEntity()', () => {
    describe('Valid Params', () => {
      it('should not throw any errors', (done) => {
        expect(() => {
          store
            .dispatch(
              loadEntity(entity, Promise.resolve(), {
                silent: true,
                append: false,
                processors: {
                  beforeSuccess: () => {},
                },
              })
            )
            .then(done)
            .catch(done);
        }).not.toThrow(Error);
      });
    });
    describe('Invalid Params', () => {
      it('should throw an error when passed no arguments', () => {
        expect(() => {
          store.dispatch(loadEntity());
        }).toThrow('Missing required entity name');
      });
      it('should throw an error when entity name is null/undefined', () => {
        expect(() => {
          store.dispatch(loadEntity(null));
        }).toThrow('Missing required entity name');
        expect(() => {
          store.dispatch(loadEntity(undefined));
        }).toThrow('Missing required entity name');
      });
      it('should throw an error when entity name not passed a String', () => {
        expect(() => {
          store.dispatch(loadEntity(123));
        }).toThrow('Missing required entity name');
        expect(() => {
          store.dispatch(loadEntity({}));
        }).toThrow('Missing required entity name');
        expect(() => {
          store.dispatch(loadEntity(new Date()));
        }).toThrow('Missing required entity name');
      });
      it('should throw an error with an undefined data promise', () => {
        expect(() => {
          store.dispatch(loadEntity(entity));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when a promise is not passed', () => {
        expect(() => {
          store.dispatch(loadEntity(entity, {}));
        }).toThrow('Missing required entity promise');
      });
      it('should throw an error when invalid options are passed', () => {
        const optionsMustBeAnObject =
          'Options must be an object. See https://github.com/mikechabot/redux-entity#configuration-options';
        const emptyOptionsObject =
          // eslint-disable-next-line max-len
          'Options object is empty! If you mean to pass options, see https://github.com/mikechabot/redux-entity#configuration-options';
        // Options as a string
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), 'foo'));
        }).toThrow(optionsMustBeAnObject);
        // Options as a number
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), 123));
        }).toThrow(optionsMustBeAnObject);
        // Options as an array
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), []));
        }).toThrow(optionsMustBeAnObject);
        // Options as a function
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), () => {}));
        }).toThrow(optionsMustBeAnObject);
        // Options as an empty object
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), {}));
        }).toThrow(emptyOptionsObject);
        // Unexpected top-level key
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { foo: 'bar' }));
        }).toThrow('Unexpected top-level option: foo');
        // Invalid type for "silent"
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { silent: 'bar' }));
        }).toThrow('Expected "boolean" but found "string" for "silent"');
        // Invalid type for "append"
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { append: 'bar' }));
        }).toThrow('Expected "boolean" but found "string" for "append"');
        // Invalid type for "processors"
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { processors: 'bar' }));
        }).toThrow('Expected "object" but found "string" for "processors"');
        // Unexpected processor key
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { processors: { foo: 'bar' } }));
        }).toThrow('Unexpected processor key "foo"');
        // Invalid subprocessor type
        expect(() => {
          store.dispatch(loadEntity(entity, Promise.resolve(), { processors: { beforeSuccess: 'bar' } }));
        }).toThrow('Expected "function" but found "string" for "beforeSuccess"');
      });
    });
    describe('when loadEntity() succeeds', () => {
      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', (done) => {
        const data = { foo: 'bar' };
        const promise = Promise.resolve(data);

        const expectedFetch = {
          type: ACTION_TYPES.FETCH_REQUEST,
          entity,
        };

        const expectedSuccess = {
          type: ACTION_TYPES.FETCH_SUCCESS,
          lastUpdated: undefined, // Overwrite this in assertion
          entity,
          data,
          append: false,
        };

        // Under test
        store
          .dispatch(loadEntity(entity, promise, null))
          .then(() => {
            // Assert 2 actions were invoked
            const actions = store.getActions();
            expect(actions.length).toEqual(2);

            // Asset FETCH_REQUEST was well-formed
            const request = actions[0];
            expect(request).toEqual(expectedFetch);

            // Assert timestamp is present and valid
            const success = actions[1];

            expect(success.lastUpdated).toBeTruthy();
            expect(typeof success.lastUpdated).toBe('number');

            // Force timestamps to match for easier assertion
            expectedSuccess.lastUpdated = success.lastUpdated;

            // Assert FETCH_SUCCESS was well-formed
            expect(success).toEqual(expectedSuccess);
          })
          .then(done)
          .catch(done);
      });
    });
    describe('when loadEntity() fails', () => {
      it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', (done) => {
        const error = { message: 'foo' };
        const promise = Promise.reject(error);

        const expectedRequest = {
          type: ACTION_TYPES.FETCH_REQUEST,
          entity,
        };

        const expectedFailure = {
          type: ACTION_TYPES.FETCH_FAILURE,
          lastUpdated: undefined, // Overwrite this in assertion
          entity,
          error,
        };

        // Under test
        store
          .dispatch(loadEntity(entity, promise, false))
          .catch(() => {
            // Assert 2 actions were invoked
            const actions = store.getActions();
            expect(actions.length).toEqual(2);

            // Asset FETCH_REQUEST was well-formed
            const request = actions[0];
            expect(request).toEqual(expectedRequest);

            // Assert timestamp is present and valid
            const failure = actions[1];
            expect(failure.lastUpdated).toBeTruthy();
            expect(typeof failure.lastUpdated).toBe('number');

            // Force timestamps to match for easier assertion
            expectedFailure.lastUpdated = failure.lastUpdated;

            // Assert FETCH_FAILURE was well-formed
            expect(failure).toEqual(expectedFailure);
          })
          .catch(done)
          .then(done);
      });
    });
    describe('when loadEntity() is configured to be silent', () => {
      it('should not dispatch a FETCH_REQUEST action', (done) => {
        const data = { foo: 'bar' };
        const promise = Promise.resolve(data);

        const expectedSuccess = {
          type: ACTION_TYPES.FETCH_SUCCESS,
          lastUpdated: undefined, // Overwrite this in assertion
          entity,
          data,
          append: false,
        };

        const configOptions = { silent: true };

        // Under test
        store
          .dispatch(loadEntity(entity, promise, configOptions))
          .then(() => {
            // Assert 1 action was invoked
            const actions = store.getActions();
            expect(actions.length).toEqual(1);

            // Assert timestamp is present and valid
            const success = actions[0];
            expect(success.lastUpdated).toBeTruthy();
            expect(typeof success.lastUpdated).toBe('number');

            // Force timestamps to match for easier assertion
            expectedSuccess.lastUpdated = success.lastUpdated;

            // Assert FETCH_SUCCESS was well-formed
            expect(success).toEqual(expectedSuccess);
          })
          .then(done)
          .catch(done);
      });
    });
    describe('when loadEntity() is configured with stage processors', () => {
      it('Stage BEFORE_SUCCESS', (done) => {
        const spy = jest.fn().mockImplementation((dispatch, getState, data) => dispatch({ type: 'foo', data }));

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_SUCCESS]: spy,
          },
        };

        // Under test
        store
          .dispatch(loadEntity(entity, Promise.resolve({}), configOptions))
          .then(() => {
            expect(spy).toHaveBeenCalled();
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_SUCCESS should return a new object', (done) => {
        const beforeSuccess = {
          _runBeforeSuccess(dispatch, getState, data) {
            return Object.keys(data);
          },
        };

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_SUCCESS]: beforeSuccess._runBeforeSuccess,
          },
        };

        // Under test
        store
          .dispatch(loadEntity(entity, Promise.resolve({ foo: 'bar' }), configOptions))
          .then(() => {
            expect(store.getActions()[1].data).toEqual(['foo']);
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_SUCCESS should mutate the existing data object', (done) => {
        const beforeSuccess = {
          _runBeforeSuccess: (dispatch, getState, data) => {
            data.foo = 'baz';
            return data;
          },
        };

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_SUCCESS]: beforeSuccess._runBeforeSuccess,
          },
        };

        // Under test
        store
          .dispatch(loadEntity(entity, Promise.resolve({ foo: 'bar' }), configOptions))
          .then(() => {
            expect(store.getActions()[1].data).toEqual({ foo: 'baz' });
          })
          .then(done)
          .catch(done);
      });
      it('Stage AFTER_SUCCESS', (done) => {
        const spy = jest.fn().mockImplementation((dispatch, getState, data) => dispatch({ type: 'foo', data }));

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.AFTER_SUCCESS]: spy,
          },
        };

        // Under test
        store
          .dispatch(loadEntity(entity, Promise.resolve({}), configOptions))
          .then(() => {
            expect(spy).toHaveBeenCalled();
          })
          .then(done)
          .catch(done);
      });
      it('Stage BEFORE_FAILURE', (done) => {
        const spy = jest.fn().mockImplementation((dispatch, getState, data) => dispatch({ type: 'foo', data }));

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_FAILURE]: spy,
          },
        };

        // Under test
        store.dispatch(loadEntity(entity, Promise.reject(new Error('Fake error')), configOptions)).catch(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
      it('Stage BEFORE_FAILURE should return a new object', (done) => {
        const beforeFailure = {
          _runBeforeFailure() {
            return new Error('Fake error 2');
          },
        };

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_FAILURE]: beforeFailure._runBeforeFailure,
          },
        };

        // Under test
        store.dispatch(loadEntity(entity, Promise.reject(new Error('Fake error 1')), configOptions)).catch(() => {
          expect(store.getActions()[1].error).toEqual(new Error('Fake error 2'));
          done();
        });
      });
      it('Stage AFTER_FAILURE', (done) => {
        const spy = jest.fn().mockImplementation((dispatch, getState, data) => dispatch({ type: 'foo', data }));

        const configOptions = {
          processors: {
            [PROCESSOR_STAGE.BEFORE_FAILURE]: spy,
          },
        };

        // Under test
        store.dispatch(loadEntity(entity, Promise.reject(new Error('Fake Error')), configOptions)).catch(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
    });
  });
});

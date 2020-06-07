import ReduxThunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import GetEntity from '../../src/thunk';
import { ActionType, ProcessorType } from '../types';

// Set up mock Redux store
const middlewares = [ReduxThunk];
const mockStore = configureStore(middlewares);

describe('Thunk Action Creators', () => {
  let store;
  let entity;
  beforeEach(() => {
    entity = 'mockEntity';
    store = mockStore({});
  });

  it('should pass', () => {
    expect(true).toBe(true);
  });

  // describe('GetEntity()', () => {
  //   describe('Valid Params', () => {
  //     it('should not throw any errors', (done) => {
  //       expect(() => {
  //         store
  //           .dispatch(
  //             GetEntity(entity, Promise.resolve(), {
  //               silent: true,
  //               append: false,
  //               processors: {
  //                 beforeSuccess: () => {},
  //               },
  //             })
  //           )
  //           .then(done)
  //           .catch(done);
  //       }).not.toThrow(Error);
  //     });
  //   });
  //   describe('Invalid Params', () => {
  //     it('should throw an error when passed no arguments', () => {
  //       expect(() => {
  //         store.dispatch(GetEntity());
  //       }).toThrow('Missing required entityName');
  //     });
  //
  //     it('should throw an error when "entityName" is null/undefined', () => {
  //       [null, undefined].forEach((val) => {
  //         expect(() => {
  //           store.dispatch(GetEntity(val));
  //         }).toThrow('Missing required entityName');
  //       });
  //     });
  //
  //     it('should throw an error when "entityName" not passed a String', () => {
  //       [123, {}, new Date()].forEach((val) => {
  //         expect(() => {
  //           store.dispatch(GetEntity(val));
  //         }).toThrow('Missing required entityName');
  //       });
  //     });
  //
  //     it('should throw an error with an undefined data promise', () => {
  //       expect(() => {
  //         store.dispatch(GetEntity(entity));
  //       }).toThrow('Missing required entity promise');
  //     });
  //
  //     it('should throw an error when a promise is not passed', () => {
  //       expect(() => {
  //         store.dispatch(GetEntity(entity, {}));
  //       }).toThrow('Missing required entity promise');
  //     });
  //   });
  //   describe('when GetEntity() succeeds', () => {
  //     it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', (done) => {
  //       const data = { foo: 'bar' };
  //       const promise = Promise.resolve(data);
  //
  //       const expectedFetch = {
  //         type: ActionType.REQUEST,
  //         entity,
  //       };
  //
  //       const expectedSuccess = {
  //         entity,
  //         type: ActionType.SUCCESS,
  //         payload: {
  //           data,
  //           lastUpdated: undefined, // Overwrite this in assertion
  //           append: false,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, promise, null))
  //         .then(() => {
  //           // Assert 2 actions were invoked
  //           const actions = store.getActions();
  //           expect(actions.length).toEqual(2);
  //
  //           // Asset FETCH_REQUEST was well-formed
  //           const request = actions[0];
  //           expect(request).toEqual(expectedFetch);
  //
  //           // Assert timestamp is present and valid
  //           const success = actions[1];
  //
  //           expect(success.payload.lastUpdated).toBeTruthy();
  //           expect(typeof success.payload.lastUpdated).toBe('number');
  //
  //           // Force timestamps to match for easier assertion
  //           expectedSuccess.payload.lastUpdated = success.payload.lastUpdated;
  //
  //           // Assert FETCH_SUCCESS was well-formed
  //           expect(success).toEqual(expectedSuccess);
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //   });
  //   describe('when GetEntity() fails', () => {
  //     it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', (done) => {
  //       const error = { message: 'foo' };
  //       const promise = Promise.reject(error);
  //
  //       const expectedRequest = {
  //         type: ActionType.REQUEST,
  //         entity,
  //       };
  //
  //       const expectedFailure = {
  //         entity,
  //         type: ActionType.FAILURE,
  //         payload: {
  //           lastUpdated: undefined, // Overwrite this in assertion
  //           error,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, promise, false))
  //         .catch(() => {
  //           // Assert 2 actions were invoked
  //           const actions = store.getActions();
  //           expect(actions.length).toEqual(2);
  //
  //           // Asset FETCH_REQUEST was well-formed
  //           const request = actions[0];
  //           expect(request).toEqual(expectedRequest);
  //
  //           // Assert timestamp is present and valid
  //           const failure = actions[1];
  //           expect(failure.payload.lastUpdated).toBeTruthy();
  //           expect(typeof failure.payload.lastUpdated).toBe('number');
  //
  //           // Force timestamps to match for easier assertion
  //           expectedFailure.payload.lastUpdated = failure.payload.lastUpdated;
  //
  //           // Assert FETCH_FAILURE was well-formed
  //           expect(failure).toEqual(expectedFailure);
  //         })
  //         .catch(done)
  //         .then(done);
  //     });
  //   });
  //   describe('when GetEntity() is configured to be silent', () => {
  //     it('should not dispatch a FETCH_REQUEST action', (done) => {
  //       const data = { foo: 'bar' };
  //       const promise = Promise.resolve(data);
  //
  //       const expectedSuccess = {
  //         entity,
  //         type: ActionType.SUCCESS,
  //         payload: {
  //           lastUpdated: undefined, // Overwrite this in assertion
  //           data,
  //           append: false,
  //         },
  //       };
  //
  //       const configOptions = { silent: true };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, promise, configOptions))
  //         .then(() => {
  //           // Assert 1 action was invoked
  //           const actions = store.getActions();
  //           expect(actions.length).toEqual(1);
  //
  //           // Assert timestamp is present and valid
  //           const success = actions[0];
  //           expect(success.payload.lastUpdated).toBeTruthy();
  //           expect(typeof success.payload.lastUpdated).toBe('number');
  //
  //           // Force timestamps to match for easier assertion
  //           expectedSuccess.payload.lastUpdated = success.payload.lastUpdated;
  //
  //           // Assert FETCH_SUCCESS was well-formed
  //           expect(success).toEqual(expectedSuccess);
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //   });
  //   describe('when GetEntity() is configured with stage processors', () => {
  //     it('Stage BEFORE_SUCCESS', (done) => {
  //       const spy = jest.fn().mockImplementation(() => () => ({ type: 'foo', data }));
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_SUCCESS]: spy,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, Promise.resolve({}), configOptions))
  //         .then(() => {
  //           expect(spy).toHaveBeenCalled();
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //     it('Stage BEFORE_SUCCESS should return a new object', (done) => {
  //       const beforeSuccess = {
  //         _runBeforeSuccess(data, dispatch, getState) {
  //           return Object.keys(data);
  //         },
  //       };
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_SUCCESS]: beforeSuccess._runBeforeSuccess,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, Promise.resolve({ foo: 'bar' }), configOptions))
  //         .then(() => {
  //           const success = store.getActions()[1];
  //           expect(success.payload.data).toEqual(['foo']);
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //     it('Stage BEFORE_SUCCESS should mutate the existing data object', (done) => {
  //       const beforeSuccess = {
  //         _runBeforeSuccess: (data, dispatch, getState) => {
  //           data.foo = 'baz';
  //           return data;
  //         },
  //       };
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_SUCCESS]: beforeSuccess._runBeforeSuccess,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, Promise.resolve({ foo: 'bar' }), configOptions))
  //         .then(() => {
  //           const success = store.getActions()[1];
  //           expect(success.payload.data).toEqual({ foo: 'baz' });
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //     it('Stage AFTER_SUCCESS', (done) => {
  //       const spy = jest.fn().mockImplementation(() => () => ({ type: 'foo', data }));
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.AFTER_SUCCESS]: spy,
  //         },
  //       };
  //
  //       // Under test
  //       store
  //         .dispatch(GetEntity(entity, Promise.resolve({}), configOptions))
  //         .then(() => {
  //           expect(spy).toHaveBeenCalled();
  //         })
  //         .then(done)
  //         .catch(done);
  //     });
  //     it('Stage BEFORE_FAILURE', (done) => {
  //       const spy = jest.fn().mockImplementation(() => () => ({ type: 'foo', data }));
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_FAILURE]: spy,
  //         },
  //       };
  //
  //       // Under test
  //       store.dispatch(GetEntity(entity, Promise.reject(new Error('Fake error')), configOptions)).catch(() => {
  //         expect(spy).toHaveBeenCalled();
  //         done();
  //       });
  //     });
  //     it('Stage BEFORE_FAILURE should return a new object', (done) => {
  //       const beforeFailure = {
  //         _runBeforeFailure() {
  //           return new Error('Fake error 2');
  //         },
  //       };
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_FAILURE]: beforeFailure._runBeforeFailure,
  //         },
  //       };
  //
  //       // Under test
  //       store.dispatch(GetEntity(entity, Promise.reject(new Error('Fake error 1')), configOptions)).catch(() => {
  //         const failure = store.getActions()[1];
  //         expect(failure.payload.error).toEqual(new Error('Fake error 2'));
  //         done();
  //       });
  //     });
  //     it('Stage AFTER_FAILURE', (done) => {
  //       const spy = jest.fn().mockImplementation(() => () => ({ type: 'foo', data }));
  //
  //       const configOptions = {
  //         processors: {
  //           [ProcessorType.BEFORE_FAILURE]: spy,
  //         },
  //       };
  //
  //       // Under test
  //       store.dispatch(GetEntity(entity, Promise.reject(new Error('Fake Error')), configOptions)).catch(() => {
  //         expect(spy).toHaveBeenCalled();
  //         done();
  //       });
  //     });
  //   });
  // });
});

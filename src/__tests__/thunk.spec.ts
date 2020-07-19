import { Store } from 'redux';
import ReduxThunk, { ThunkDispatch } from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import GetEntity from '../../src/thunk';

import { EntityAction, EntityActionType, ProcessorType, ReduxEntityOptions, ReduxEntityState } from '../types';

type DispatchExts = ThunkDispatch<ReduxEntityState, undefined, EntityAction>;
const middlewares = [ReduxThunk];
const mockStore = configureMockStore<ReduxEntityState, DispatchExts>(middlewares);

describe('Thunk Action Creators', () => {
  const entity = 'mockEntity';
  let store: Store;
  beforeEach(() => {
    store = mockStore({});
  });

  describe('GetEntity()', () => {
    describe('Valid Params', () => {
      it('should not throw any errors', (done) => {
        expect(() => {
          store.dispatch<any>(GetEntity(entity, Promise.resolve())).then(done);
        }).not.toThrow(Error);
      });
    });

    describe('Bad Arguments', () => {
      it('should throw an error when no arguments are passed', () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(GetEntity());
        }).toThrow('Missing required entityName');
      });

      it('should throw an error when "entityName" is null/undefined', () => {
        [null, undefined].forEach((val) => {
          expect(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch(GetEntity(val));
          }).toThrow('Missing required entityName');
        });
      });

      it('should throw an error when "entityName" not passed a string"', () => {
        [123, {}, new Date(), []].forEach((val) => {
          expect(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.dispatch(GetEntity(val));
          }).toThrow('Missing required entityName');
        });
      });

      it('should throw an error with an undefined data promise', () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(GetEntity(entity));
        }).toThrow('Missing required entity promise');
      });

      it('should throw an error when a promise is not passed', () => {
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          store.dispatch(GetEntity(entity, {}));
        }).toThrow('Missing required entity promise');
      });
    });

    describe('Promise Resolution', () => {
      const data = { foo: 'bar' };

      const expectedFetch = { entity, type: EntityActionType.Request };

      const expectedSuccess = {
        entity,
        type: EntityActionType.Success,
        payload: {
          data,
          lastUpdated: undefined,
          append: false,
        },
      };

      const expectedActions = [expectedFetch, expectedSuccess];

      it('should dispatch FETCH_REQUEST and FETCH_SUCCESS actions', (done) => {
        const thunk = GetEntity(entity, Promise.resolve(data));
        store.dispatch<any>(thunk).then(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const actions = store.getActions();

          expect(actions).toHaveLength(2);

          expectedSuccess.payload.lastUpdated = actions[1].payload.lastUpdated;

          expect(expectedActions).toEqual(actions);

          done();
        });
      });
    });
    describe('Promise Rejection', () => {
      const error = new Error('API Failure');

      const expectedRequest = { entity, type: EntityActionType.Request };

      const expectedFailure = {
        entity,
        type: EntityActionType.Failure,
        payload: {
          lastUpdated: undefined,
          error,
        },
      };

      const expectedActions = [expectedRequest, expectedFailure];

      it('should dispatch FETCH_REQUEST and FETCH_FAILURE actions', (done) => {
        const thunk = GetEntity(entity, Promise.reject(error));
        store.dispatch<any>(thunk).catch(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const actions = store.getActions();
          expect(actions).toHaveLength(2);

          expectedFailure.payload.lastUpdated = actions[1].payload.lastUpdated;

          expect(expectedActions).toEqual(actions);

          done();
        });
      });
    });
    describe('Silent Option', () => {
      const data = { foo: 'bar' };

      const expectedSuccess = {
        entity,
        type: EntityActionType.Success,
        payload: {
          lastUpdated: undefined,
          data,
          append: false,
        },
      };

      const configOptions: ReduxEntityOptions = { silent: true };

      it('should not dispatch a FETCH_REQUEST action', (done) => {
        const thunk = GetEntity(entity, Promise.resolve(data), configOptions);
        store.dispatch<any>(thunk).then(() => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const actions = store.getActions();
          expect(actions).toHaveLength(1);

          const successAction = actions[0];

          // Force timestamps to match for easier assertion
          expectedSuccess.payload.lastUpdated = successAction.payload.lastUpdated;

          // Assert FETCH_SUCCESS was well-formed
          expect(successAction).toEqual(expectedSuccess);

          done();
        });
      });
    });
    describe('Processor Types', () => {
      describe('Processor Invocation', () => {
        it('should invoke the Success processor types', (done) => {
          const beforeSpy = jest.fn().mockImplementation(() => ({}));
          const afterSpy = jest.fn().mockImplementation(() => ({}));

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeSuccess]: beforeSpy,
              [ProcessorType.AfterSuccess]: afterSpy,
            },
          };

          const thunk = GetEntity(entity, Promise.resolve({}), options);
          store.dispatch<any>(thunk).then(() => {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });

        it('should invoke the Failure processor types', (done) => {
          const beforeSpy = jest.fn().mockImplementation(() => ({}));
          const afterSpy = jest.fn().mockImplementation(() => ({}));

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeFailure]: beforeSpy,
              [ProcessorType.AfterFailure]: afterSpy,
            },
          };

          const thunk = GetEntity(entity, Promise.reject({}), options);
          store.dispatch<any>(thunk).catch(() => {
            expect(beforeSpy).toHaveBeenCalledTimes(1);
            expect(afterSpy).toHaveBeenCalledTimes(1);
            done();
          });
        });

        it('should invoke the Success processor types with data, dispatch, and getState', (done) => {
          const promiseData = { foo: 'bar' };

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeSuccess]: (data: any, dispatch, getState) => {
                expect(data).toEqual(promiseData);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_Before_Success' });
                return data;
              },
              [ProcessorType.AfterSuccess]: (data: any, dispatch, getState) => {
                expect(data).toEqual(promiseData);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_After_Success' });
              },
            },
          };

          const thunk = GetEntity(entity, Promise.resolve(promiseData), options);
          store.dispatch<any>(thunk).then(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actions = store.getActions();
            expect(actions).toHaveLength(4);
            done();
          });
        });

        it('should invoke the Failure processor types with data, dispatch, and getState', (done) => {
          const promiseError = new Error('API Error');

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeFailure]: (error: any, dispatch, getState) => {
                expect(error).toEqual(promiseError);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_Before_Failure' });
                return error;
              },
              [ProcessorType.AfterFailure]: (error: any, dispatch, getState) => {
                expect(error).toEqual(promiseError);
                expect(typeof dispatch).toEqual('function');
                expect(typeof getState).toEqual('function');
                dispatch({ type: 'In_After_Failure' });
              },
            },
          };

          const thunk = GetEntity(entity, Promise.reject(promiseError), options);
          store.dispatch<any>(thunk).catch(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actions = store.getActions();
            expect(actions).toHaveLength(4);

            done();
          });
        });
      });

      describe('BEFORE_SUCCESS', () => {
        it('should return the data as modified in the processor', (done) => {
          const data = { foo: 'bar', baz: 'qux' };
          const expectedArray = Object.keys(data);

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeSuccess]: (data: any) => Object.keys(data),
            },
          };

          const thunk = GetEntity(entity, Promise.resolve(data), options);
          store.dispatch<any>(thunk).then(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actions = store.getActions();
            expect(actions).toHaveLength(2);

            const success = actions[1];
            expect(success.payload.data).toEqual(expectedArray);

            done();
          });
        });

        it('should return the mutated data as modified in the processor', (done) => {
          const data = { foo: 'bar' };
          const mutatedData = {
            foo: 'foo',
            baz: 'qux',
          };

          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeSuccess]: (data: any) => ({
                ...data,
                foo: 'foo',
                baz: 'qux',
              }),
            },
          };

          const thunk = GetEntity(entity, Promise.resolve(data), options);
          store.dispatch<any>(thunk).then(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actions = store.getActions();
            expect(actions).toHaveLength(2);

            const success = actions[1];
            expect(success.payload.data).toEqual(mutatedData);

            done();
          });
        });
      });

      describe('BEFORE_FAILURE', () => {
        const apiError = new Error('Fake error 1');
        const newError = new Error('Fake error 2');

        it('should return a new error', (done) => {
          const options: ReduxEntityOptions = {
            processors: {
              [ProcessorType.BeforeFailure]: () => newError,
            },
          };

          const thunk = GetEntity(entity, Promise.reject(apiError), options);
          store.dispatch<any>(thunk).catch(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const actions = store.getActions();
            expect(actions).toHaveLength(2);

            const failure = actions[1];
            expect(failure.payload.error).toEqual(newError);
            done();
          });
        });
      });
    });
  });
});

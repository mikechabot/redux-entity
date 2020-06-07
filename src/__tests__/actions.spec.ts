import {
  fetchFailureCreator,
  fetchRequestCreator,
  fetchSuccessCreator,
  makeActionCreator,
  makeEntityActionCreator,
} from '../actions';

import { ActionType } from '../types';

describe('Action Creators', () => {
  const typeError = new Error('Type cannot be null/undefined');
  const entityError = new Error('Entity cannot be null/undefined');

  describe('Generic', () => {
    describe('makeActionCreator', () => {
      it('should be a function', () => {
        expect(typeof makeActionCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof makeActionCreator(ActionType.SUCCESS)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // @ts-ignore
        expect(() => makeActionCreator()).toThrow(typeError);
      });

      describe('Invoking the returned function', () => {
        it('should return an object containing the action type', () => {
          const expectedAction = { type: ActionType.SUCCESS };
          const action = makeActionCreator(ActionType.SUCCESS);
          expect(action()).toEqual(expectedAction);
        });

        it('should return an object containing the action type, and the payload keys', () => {
          const key1 = 'foo';
          const key2 = 'bar';

          const value1 = 'bar';
          const value2 = 'qux';

          const expectedAction = {
            type: ActionType.SUCCESS,
            payload: {
              [key1]: value1,
              [key2]: value2,
            },
          };

          const action = makeActionCreator(ActionType.SUCCESS, key1 as any, key2 as any);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
    describe('makeEntityActionCreator', () => {
      const entity = 'foo';

      it('should be a function', () => {
        expect(typeof makeEntityActionCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof makeEntityActionCreator(ActionType.SUCCESS, entity)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // @ts-ignore
        expect(() => makeEntityActionCreator()).toThrow(typeError);
      });

      it('should throw an error if entity is not passed', () => {
        // @ts-ignore
        expect(() => makeEntityActionCreator(ActionType.SUCCESS)).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return an object containing the action type', () => {
          const expectedAction = { type: ActionType.SUCCESS, entity };
          const action = makeEntityActionCreator(ActionType.SUCCESS, entity);
          expect(action()).toEqual(expectedAction);
        });

        it('should return an object containing the action type, and the payload keys', () => {
          const key1 = 'foo';
          const key2 = 'bar';

          const value1 = 'bar';
          const value2 = 'qux';

          const expectedAction = {
            entity,
            type: ActionType.SUCCESS,
            payload: {
              [key1]: value1,
              [key2]: value2,
            },
          };

          const action = makeEntityActionCreator(ActionType.SUCCESS, entity, key1 as any, key2 as any);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
  });

  describe('Action Types', () => {
    const entity = 'foo';

    describe('Request', () => {
      it('should be a function', () => {
        expect(typeof fetchRequestCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof fetchRequestCreator(entity)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // @ts-ignore
        expect(() => fetchRequestCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a request action to be dispatched', () => {
          const expectedAction = {
            entity,
            type: ActionType.REQUEST,
          };
          const action = fetchRequestCreator(entity);
          expect(action()).toEqual(expectedAction);
        });
      });
    });

    describe('Success', () => {
      it('should be a function', () => {
        expect(typeof fetchSuccessCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof fetchSuccessCreator(entity)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // @ts-ignore
        expect(() => fetchSuccessCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a success action to be dispatched, with an empty payload', () => {
          const expectedAction = {
            entity,
            type: ActionType.SUCCESS,
            payload: {
              data: undefined,
              append: undefined,
              lastUpdated: undefined,
            },
          };
          const action = fetchSuccessCreator(entity);
          expect(action()).toEqual(expectedAction);
        });

        it('should return a success action to be dispatched, with a proper payload', () => {
          const lastUpdated = new Date();
          const data = ['123'];
          const append = true;

          const expectedAction = {
            entity,
            type: ActionType.SUCCESS,
            payload: {
              data,
              append,
              lastUpdated,
            },
          };
          const action = fetchSuccessCreator(entity);
          expect(action(data, lastUpdated, append)).toEqual(expectedAction);
        });
      });
    });

    describe('Failure', () => {
      it('should be a function', () => {
        expect(typeof fetchFailureCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof fetchFailureCreator(entity)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // @ts-ignore
        expect(() => fetchFailureCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a failure action to be dispatched, with an empty payload', () => {
          const expectedAction = {
            entity,
            type: ActionType.FAILURE,
            payload: {
              error: undefined,
              lastUpdated: undefined,
            },
          };
          const action = fetchFailureCreator(entity);
          expect(action()).toEqual(expectedAction);
        });

        it('should return a failure action to be dispatched, with a proper payload', () => {
          const lastUpdated = new Date();
          const error = new Error('API Error');
          const append = true;

          const expectedAction = {
            entity,
            type: ActionType.FAILURE,
            payload: {
              error,
              lastUpdated,
            },
          };
          const action = fetchFailureCreator(entity);
          expect(action(error, lastUpdated)).toEqual(expectedAction);
        });
      });
    });
  });
});

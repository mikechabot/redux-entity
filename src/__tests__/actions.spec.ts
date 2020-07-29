import {
  fetchFailureCreator,
  fetchRequestCreator,
  fetchSuccessCreator,
  makeEntityActionCreator,
  ResetEntity,
  DeleteEntity,
} from '../actions';

import { EntityActionType } from '../types';

describe('Action Creators', () => {
  const typeError = new Error('Type cannot be null/undefined');
  const entityError = new Error('Entity cannot be null/undefined');

  describe('Generic', () => {
    describe('makeEntityActionCreator', () => {
      const entity = 'foo';

      it('should be a function', () => {
        expect(typeof makeEntityActionCreator).toEqual('function');
      });

      it('should return a function', () => {
        expect(typeof makeEntityActionCreator(EntityActionType.Success, entity)).toEqual('function');
      });

      it('should throw an error if a type is not passed', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => makeEntityActionCreator()).toThrow(typeError);
      });

      it('should throw an error if entity is not passed', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => makeEntityActionCreator(EntityActionType.Success)).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return an object containing the action type', () => {
          const expectedAction = { type: EntityActionType.Success, entity };
          const action = makeEntityActionCreator(EntityActionType.Success, entity);
          expect(action()).toEqual(expectedAction);
        });

        it('should return an object containing the action type, and the payload keys', () => {
          const key1 = 'foo';
          const key2 = 'bar';

          const value1 = 'bar';
          const value2 = 'qux';

          const expectedAction = {
            entity,
            type: EntityActionType.Success,
            payload: {
              [key1]: value1,
              [key2]: value2,
            },
          };

          const action = makeEntityActionCreator(EntityActionType.Success, entity, key1 as any, key2 as any);
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => fetchRequestCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a request action to be dispatched', () => {
          const expectedAction = {
            entity,
            type: EntityActionType.Request,
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => fetchSuccessCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a success action to be dispatched, with an empty payload', () => {
          const expectedAction = {
            entity,
            type: EntityActionType.Success,
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
            type: EntityActionType.Success,
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(() => fetchFailureCreator()).toThrow(entityError);
      });

      describe('Invoking the returned function', () => {
        it('should return a failure action to be dispatched, with an empty payload', () => {
          const expectedAction = {
            entity,
            type: EntityActionType.Failure,
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

          const expectedAction = {
            entity,
            type: EntityActionType.Failure,
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

    describe('Reset', () => {
      it('should be a function', () => {
        expect(typeof ResetEntity).toEqual('function');
      });

      it('should return an action object', () => {
        const date = new Date();

        const expectedAction = {
          entity,
          type: EntityActionType.Reset,
          payload: {
            lastUpdated: date,
          },
        };
        const action = ResetEntity(entity);
        expect(action).toEqual(expectedAction);
      });
    });

    describe('Delete', () => {
      it('should be a function', () => {
        expect(typeof DeleteEntity).toEqual('function');
      });

      it('should return an action object', () => {
        const date = new Date();

        const expectedAction = {
          entity,
          type: EntityActionType.Delete,
        };
        const action = DeleteEntity(entity);
        expect(action).toEqual(expectedAction);
      });
    });
  });
});

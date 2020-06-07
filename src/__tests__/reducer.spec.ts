import reducer from '../../src/reducer';
import { Action, ActionType, Payload } from '../types';

const INITIAL_STATE = {};

const INITIAL_ENTITY_STATE = {
  data: undefined,
  lastUpdated: undefined,
  isFetching: false,
  error: undefined,
};

describe('Reducer', () => {
  let entity: string;
  let lastUpdated: Date;
  beforeAll(() => {
    entity = 'foo';
    lastUpdated = new Date();
  });

  describe('Existing State', () => {
    it('should return the initial state when "state" is undefined, and the action "type" is unknown', () => {
      const action: Action = { type: 'bar' as any };
      const state = reducer(undefined, action);
      expect(state).toEqual(INITIAL_STATE);
    });

    it('should return state when "state" is defined, and the action "type" is unknown', () => {
      const existingState = { foo: { isFetching: true } };
      const action: Action = { type: 'bar' as any };
      const state = reducer(existingState, action);
      expect(state).toEqual(existingState);
    });
  });

  describe('Reset', () => {
    it('should revert the entity to the default entity state', () => {
      const existingState = { [entity]: { isFetching: true, data: ['bar'] } };
      const expectedState = { [entity]: { isFetching: false, lastUpdated } };

      const action: Action = {
        entity,
        type: ActionType.RESET,
        payload: { lastUpdated },
      };

      const state = reducer(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('Delete', () => {
    it('should delete the entity from the root reducer', () => {
      const entity2 = 'bar';

      const existingState = {
        [entity]: { isFetching: true, data: 'baz' },
        [entity2]: { isFetching: true, data: 123 },
      };

      const expectedState = {
        [entity2]: { isFetching: true, data: 123 },
      };

      const action: Action = {
        entity: entity,
        type: ActionType.DELETE,
      };

      const state = reducer(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('Request', () => {
    it('should set "isFetching" to true, and null the error', () => {
      const existingState = { [entity]: { isFetching: false, error: new Error('Previous Failure') } };
      const expectedState = { [entity]: { isFetching: true, error: null } };

      const action: Action = {
        entity,
        type: ActionType.REQUEST,
      };

      const state = reducer(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('Success', () => {
    it('should set "isFetching" to false, null the error, and set the payload', () => {
      const payload: Payload = {
        lastUpdated,
        data: 123,
      };

      const existingState = { [entity]: { isFetching: true, error: new Error('Previous Failure') } };
      const expectedState = { [entity]: { isFetching: false, error: null, data: payload.data, lastUpdated } };

      const action: Action = {
        entity,
        payload,
        type: ActionType.SUCCESS,
      };

      const state = reducer(existingState, action);
      expect(state).toEqual(expectedState);
    });

    describe('Append', () => {
      it('should convert non-arrayed payload data to an array if existing data does not exist', () => {
        const payload: Payload = {
          lastUpdated,
          append: true,
          data: { bar: 'baz' },
        };

        const existingState = { [entity]: { isFetching: true, error: new Error('Previous Failure') } };
        const expectedState = { [entity]: { isFetching: false, error: null, data: [payload.data], lastUpdated } };

        const action: Action = {
          entity,
          payload,
          type: ActionType.SUCCESS,
        };

        const state = reducer(existingState, action);
        expect(state).toEqual(expectedState);
      });

      it('should not convert arrayed payload data if existing data does not exist', () => {
        const payload: Payload = {
          lastUpdated,
          append: true,
          data: [{ bar: 'baz' }],
        };

        const existingState = { [entity]: { isFetching: true, error: new Error('Previous Failure') } };
        const expectedState = { [entity]: { isFetching: false, error: null, data: payload.data, lastUpdated } };

        const action: Action = {
          entity,
          payload,
          type: ActionType.SUCCESS,
        };

        const state = reducer(existingState, action);
        expect(state).toEqual(expectedState);
      });

      it('should append arrayed payload data to the existing data array', () => {
        const payload: Payload = {
          lastUpdated,
          append: true,
          data: [{ bar: 'baz' }],
        };

        const existingState = {
          [entity]: { isFetching: true, data: [{ baz: 'qux' }], error: new Error('Previous Failure') },
        };
        const expectedState = {
          [entity]: { isFetching: false, error: null, data: [{ baz: 'qux' }, ...payload.data], lastUpdated },
        };

        const action: Action = {
          entity,
          payload,
          type: ActionType.SUCCESS,
        };

        const state = reducer(existingState, action);
        expect(state).toEqual(expectedState);
      });

      it('should append non-arrayed payload data to the existing data array', () => {
        const payload: Payload = {
          lastUpdated,
          append: true,
          data: { bar: 'baz' },
        };

        const existingState = {
          [entity]: { isFetching: true, data: [{ baz: 'qux' }], error: new Error('Previous Failure') },
        };
        const expectedState = {
          [entity]: { isFetching: false, error: null, data: [{ baz: 'qux' }, payload.data], lastUpdated },
        };

        const action: Action = {
          entity,
          payload,
          type: ActionType.SUCCESS,
        };

        const state = reducer(existingState, action);
        expect(state).toEqual(expectedState);
      });
    });
  });

  describe('Failure', () => {
    it('should set "isFetching" to false, null the data, and set the error', () => {
      const error = new Error('API Error');

      const payload: Payload = {
        lastUpdated,
        error,
      };

      const existingState = { [entity]: { isFetching: true, data: { baz: 'qux' } } };
      const expectedState = { [entity]: { isFetching: false, error, data: null, lastUpdated } };

      const action: Action = {
        entity,
        payload,
        type: ActionType.FAILURE,
      };

      const state = reducer(existingState, action);
      expect(state).toEqual(expectedState);
    });
  });
});

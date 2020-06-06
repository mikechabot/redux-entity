import reducer from '../../src/reducer';
import { ACTION_TYPES, INITIAL_ENTITY_STATE } from '../const';

describe('Reducer', () => {
  describe('invoking the reducer', () => {
    describe('with an undefined state and an unmapped type', () => {
      it('should return the default state', () => {
        const state = reducer(undefined, { type: null });
        expect(state).toEqual({});
      });
    });
    describe('with a defined state and an unmapped type', () => {
      it('should return the defined state', () => {
        const state = { foo: 'bar' };
        expect(reducer(state, { type: null })).toEqual(state);
      });
    });
    describe('with a defined action of', () => {
      let lastUpdated;
      let entity;
      let existingState;
      beforeEach(() => {
        entity = 'foo';
        lastUpdated = Date.now();
        existingState = {
          [entity]: {
            data: null,
            isFetching: false,
            error: null,
            lastUpdated: Date.now(),
          },
        };
      });

      describe('FETCH_REQUEST', () => {
        it('should set the isFetching property to true', () => {
          const expectedState = {
            data: null,
            error: null,
            isFetching: true,
            lastUpdated: existingState[entity].lastUpdated,
          };

          const action = ACTION_TYPES.FETCH_REQUEST;

          // Under test
          const state = reducer(existingState, { entity, lastUpdated, type: action });

          expect(state).toEqual({ [entity]: expectedState });
        });
      });
      describe('FETCH_SUCCESS', () => {
        it('should update the data, error, isFetching and lastUpdated properties', () => {
          const data = { foo: 'bar' };

          const expectedState = {
            data,
            error: null,
            isFetching: false,
            lastUpdated,
          };

          const action = ACTION_TYPES.FETCH_SUCCESS;

          // Under test
          const state = reducer(existingState, {
            entity,
            data,
            lastUpdated,
            type: action,
          });
          expect(state[entity]).toEqual(expectedState);
        });
        it('if append is true, then new data should be pushed onto the existing array (objects)', () => {
          existingState[entity].data = [{ baz: 'bar' }];
          const data = { foo: 'bar' };

          const expectedState = {
            data: [{ baz: 'bar' }, { foo: 'bar' }],
            error: null,
            isFetching: false,
            lastUpdated,
          };

          const action = ACTION_TYPES.FETCH_SUCCESS;

          // Under test
          const state = reducer(existingState, {
            entity,
            data,
            lastUpdated,
            type: action,
            append: true,
          });
          expect(state[entity]).toEqual(expectedState);
        });
        it('if append is true, then new data should be concatenated with the existing array (array)', () => {
          existingState[entity].data = [123, 456];
          const data = [789, 101112];

          const expectedState = {
            data: [123, 456, 789, 101112],
            error: null,
            isFetching: false,
            lastUpdated,
          };

          const action = ACTION_TYPES.FETCH_SUCCESS;

          // Under test
          const state = reducer(existingState, {
            entity,
            data,
            lastUpdated,
            type: action,
            append: true,
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('FETCH_FAILURE', () => {
        it('should update the data, error, isFetching and lastUpdated properties', () => {
          const error = new Error('Something bad');
          const data = null;

          const expectedState = {
            data,
            error,
            isFetching: false,
            lastUpdated,
          };

          const action = ACTION_TYPES.FETCH_FAILURE;

          // Under test
          const state = reducer(existingState, {
            entity,
            data,
            error,
            lastUpdated,
            type: action,
          });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', () => {
        it('should revert the entity to the default entity state', () => {
          const expectedState = Object.assign({}, INITIAL_ENTITY_STATE, { lastUpdated });
          const action = ACTION_TYPES.RESET_ENTITY;

          // Under test
          const state = reducer(existingState, { entity, lastUpdated, type: action });
          expect(state[entity]).toEqual(expectedState);
        });
      });
      describe('RESET_ENTITY', () => {
        it('should revert the entity to the default entity state', () => {
          const action = ACTION_TYPES.DELETE_ENTITY;

          // Under test
          const state = reducer(existingState, { entity, type: action });
          expect(state[entity]).toEqual(undefined);
        });
      });
    });
  });
});

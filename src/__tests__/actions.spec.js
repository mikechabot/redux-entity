import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import {
  fetchRequestCreator,
  fetchSuccessCreator,
  fetchFailureCreator,
  makeActionCreator,
  makeEntityActionCreator,
} from '../actions';

import { ACTION_TYPES } from '../const';

// Set up mock Redux store
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('Action Creators', () => {
  describe('Generic', () => {
    describe('invoking the makeActionCreator thunk', () => {
      let type;
      let key1;
      let key2;
      let data1;
      let data2;
      beforeEach(() => {
        type = 'FooType';
        key1 = 'key1';
        key2 = 'key2';
        data1 = 'data1';
        data2 = 'data2';
      });

      it('should return a function', () => {
        expect(typeof makeActionCreator(type, key1, key2)).toBe('function');
      });

      it('should throw an error if a type is not passed', () => {
        expect(() => {
          makeActionCreator();
        }).toThrow('Type cannot be null/undefined');
      });

      describe('invoking the returned action creator', () => {
        it('should return an action containing the correct type and keys', () => {
          const expectedAction = {
            type,
            key1: data1,
            key2: data2,
          };

          expect(makeActionCreator(type, key1, key2)(data1, data2)).toEqual(expectedAction);
        });
      });
    });
    describe('invoking the makeEntityActionCreator thunk', () => {
      let type;
      let entity;
      let key1;
      let key2;
      let data1;
      let data2;
      beforeEach(() => {
        type = 'FooType';
        entity = 'testModel';
        key1 = 'key1';
        key2 = 'key2';
        data1 = 'data1';
        data2 = 'data2';
      });

      it('should return a function', () => {
        expect(typeof makeEntityActionCreator(type, entity, key1, key2)).toBe('function');
      });

      it('should throw an error if a type is not passed', () => {
        expect(() => {
          makeEntityActionCreator();
        }).toThrow('Type cannot be null/undefined');
      });

      it('should throw an error if an entity is not passed', () => {
        expect(() => {
          makeEntityActionCreator(type);
        }).toThrow('Entity cannot be null/undefined');
      });

      describe('invoking the returned action creator', () => {
        it('should return an action containing the correct type and keys', () => {
          const expectedAction = {
            type,
            entity,
            key1: data1,
            key2: data2,
          };

          const actionCreator = makeEntityActionCreator(type, entity, key1, key2);

          expect(actionCreator(data1, data2)).toEqual(expectedAction);
        });
      });
    });
  });
  describe('API', () => {
    let store;
    let getState;
    let mockEntity;
    beforeEach(() => {
      mockEntity = 'mockEntity';
      getState = {};
      store = mockStore(getState);
    });

    describe('invoking the fetchRequest action creator', () => {
      it('should create a FETCH_REQUEST action', () => {
        const fetchRequestAction = {
          type: ACTION_TYPES.FETCH_REQUEST,
          entity: mockEntity,
        };

        // Under test
        store.dispatch(fetchRequestCreator(mockEntity)());

        expect(store.getActions()).toEqual([fetchRequestAction]);
      });
    });

    describe('invoking the fetchSuccess action creator', () => {
      const mockData = { foo: 'bar' };
      const now = Date.now();

      it('should create a FETCH_SUCCESS action', () => {
        const fetchSuccessAction = {
          type: ACTION_TYPES.FETCH_SUCCESS,
          entity: mockEntity,
          data: mockData,
          lastUpdated: now,
          append: false,
        };

        // Under test
        store.dispatch(fetchSuccessCreator(mockEntity)(mockData, now, false));

        expect(store.getActions()).toEqual([fetchSuccessAction]);
      });
    });

    describe('invoking the fetchFailure action creator', () => {
      const mockError = { foo: 'bar' };
      const now = Date.now();

      it('should create a FETCH_FAILURE action', () => {
        const fetchFailureAction = {
          entity: mockEntity,
          type: ACTION_TYPES.FETCH_FAILURE,
          error: mockError,
          lastUpdated: now,
        };

        // Under test
        store.dispatch(fetchFailureCreator(mockEntity)(mockError, now));

        expect(store.getActions()).toEqual([fetchFailureAction]);
      });
    });
  });
});

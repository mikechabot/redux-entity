const expect = require('expect');
const reducer = require('../../src/reducer');
const CONST = require('../../src/common/const');

const ACTION_TYPES = CONST.ACTION_TYPES;

describe('Reducer', () => {
    describe('invoking the reducer', () => {
        describe('with an undefined state and an unmapped type', () => {
            it('should return the default state', () => {
                const state = reducer(undefined, { type: null });
                expect(state).toEqual(CONST.INITIAL_STATE);
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
            beforeEach(() => {
                entity = 'foo';
                lastUpdated = Date.now();
            });

            describe('FETCH_REQUEST', () => {
                it('should set the isFetching property to true', () => {
                    const expectedState = {
                        data       : null,
                        error      : null,
                        isFetching : true,
                        lastUpdated: undefined
                    };

                    const action = ACTION_TYPES.FETCH_REQUEST;

                    // Under test
                    const state = reducer({}, { entity, lastUpdated, type: action });

                    expect(state).toEqual({
                        [entity]: expectedState
                    });
                });
            });
            describe('FETCH_SUCCESS', () => {
                it('should update the data, error, isFetching and lastUpdated properties', () => {
                    const data = { foo: 'bar' };

                    const expectedState = {
                        data       : data,
                        error      : null,
                        isFetching : false,
                        lastUpdated: lastUpdated
                    };

                    const action = ACTION_TYPES.FETCH_SUCCESS;

                    // Under test
                    const state = reducer({}, { entity, data, lastUpdated, type: action });

                    expect(state).toEqual({
                        [entity]: expectedState
                    });
                });
            });
            describe('FETCH_FAILURE', () => {
                it('should update the data, error, isFetching and lastUpdated properties', () => {

                    const error = new Error('Something bad');
                    const data = null;

                    const expectedState = {
                        data       : data,
                        error      : error,
                        isFetching : false,
                        lastUpdated: lastUpdated
                    };

                    const action = ACTION_TYPES.FETCH_FAILURE;

                    // Under test
                    const state = reducer({}, { entity, data, error, lastUpdated, type: action });

                    expect(state).toEqual({
                        [entity]: expectedState
                    });
                });
            });
        });
    });
});

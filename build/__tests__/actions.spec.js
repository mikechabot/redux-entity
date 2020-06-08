'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var actions_1 = require('../actions');
var types_1 = require('../types');
describe('Action Creators', function () {
  var typeError = new Error('Type cannot be null/undefined');
  var entityError = new Error('Entity cannot be null/undefined');
  describe('Generic', function () {
    describe('makeActionCreator', function () {
      it('should be a function', function () {
        expect(typeof actions_1.makeActionCreator).toEqual('function');
      });
      it('should return a function', function () {
        expect(typeof actions_1.makeActionCreator(types_1.EntityActionType.Success)).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.makeActionCreator();
        }).toThrow(typeError);
      });
      describe('Invoking the returned function', function () {
        it('should return an object containing the action type', function () {
          var expectedAction = { type: types_1.EntityActionType.Success };
          var action = actions_1.makeActionCreator(types_1.EntityActionType.Success);
          expect(action()).toEqual(expectedAction);
        });
        it('should return an object containing the action type, and the payload keys', function () {
          var _a;
          var key1 = 'foo';
          var key2 = 'bar';
          var value1 = 'bar';
          var value2 = 'qux';
          var expectedAction = {
            type: types_1.EntityActionType.Success,
            payload: ((_a = {}), (_a[key1] = value1), (_a[key2] = value2), _a),
          };
          var action = actions_1.makeActionCreator(types_1.EntityActionType.Success, key1, key2);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
    describe('makeEntityActionCreator', function () {
      var entity = 'foo';
      it('should be a function', function () {
        expect(typeof actions_1.makeEntityActionCreator).toEqual('function');
      });
      it('should return a function', function () {
        expect(typeof actions_1.makeEntityActionCreator(types_1.EntityActionType.Success, entity)).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.makeEntityActionCreator();
        }).toThrow(typeError);
      });
      it('should throw an error if entity is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.makeEntityActionCreator(types_1.EntityActionType.Success);
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return an object containing the action type', function () {
          var expectedAction = { type: types_1.EntityActionType.Success, entity: entity };
          var action = actions_1.makeEntityActionCreator(types_1.EntityActionType.Success, entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return an object containing the action type, and the payload keys', function () {
          var _a;
          var key1 = 'foo';
          var key2 = 'bar';
          var value1 = 'bar';
          var value2 = 'qux';
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Success,
            payload: ((_a = {}), (_a[key1] = value1), (_a[key2] = value2), _a),
          };
          var action = actions_1.makeEntityActionCreator(types_1.EntityActionType.Success, entity, key1, key2);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
  });
  describe('Action Types', function () {
    var entity = 'foo';
    describe('Request', function () {
      it('should be a function', function () {
        expect(typeof actions_1.fetchRequestCreator).toEqual('function');
      });
      it('should return a function', function () {
        expect(typeof actions_1.fetchRequestCreator(entity)).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.fetchRequestCreator();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a request action to be dispatched', function () {
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Request,
          };
          var action = actions_1.fetchRequestCreator(entity);
          expect(action()).toEqual(expectedAction);
        });
      });
    });
    describe('Success', function () {
      it('should be a function', function () {
        expect(typeof actions_1.fetchSuccessCreator).toEqual('function');
      });
      it('should return a function', function () {
        expect(typeof actions_1.fetchSuccessCreator(entity)).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.fetchSuccessCreator();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a success action to be dispatched, with an empty payload', function () {
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Success,
            payload: {
              data: undefined,
              append: undefined,
              lastUpdated: undefined,
            },
          };
          var action = actions_1.fetchSuccessCreator(entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return a success action to be dispatched, with a proper payload', function () {
          var lastUpdated = new Date();
          var data = ['123'];
          var append = true;
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Success,
            payload: {
              data: data,
              append: append,
              lastUpdated: lastUpdated,
            },
          };
          var action = actions_1.fetchSuccessCreator(entity);
          expect(action(data, lastUpdated, append)).toEqual(expectedAction);
        });
      });
    });
    describe('Failure', function () {
      it('should be a function', function () {
        expect(typeof actions_1.fetchFailureCreator).toEqual('function');
      });
      it('should return a function', function () {
        expect(typeof actions_1.fetchFailureCreator(entity)).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return actions_1.fetchFailureCreator();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a failure action to be dispatched, with an empty payload', function () {
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Failure,
            payload: {
              error: undefined,
              lastUpdated: undefined,
            },
          };
          var action = actions_1.fetchFailureCreator(entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return a failure action to be dispatched, with a proper payload', function () {
          var lastUpdated = new Date();
          var error = new Error('API Error');
          var expectedAction = {
            entity: entity,
            type: types_1.EntityActionType.Failure,
            payload: {
              error: error,
              lastUpdated: lastUpdated,
            },
          };
          var action = actions_1.fetchFailureCreator(entity);
          expect(action(error, lastUpdated)).toEqual(expectedAction);
        });
      });
    });
  });
});

'use strict';

var _actions = require('../actions');

var _types = require('../types');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _typeof(obj) {
  '@babel/helpers - typeof';
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

describe('Action Creators', function () {
  var typeError = new Error('Type cannot be null/undefined');
  var entityError = new Error('Entity cannot be null/undefined');
  describe('Generic', function () {
    describe('makeActionCreator', function () {
      it('should be a function', function () {
        expect(_typeof(_actions.makeActionCreator)).toEqual('function');
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.makeActionCreator)(_types.EntityActionType.SUCCESS))).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.makeActionCreator)();
        }).toThrow(typeError);
      });
      describe('Invoking the returned function', function () {
        it('should return an object containing the action type', function () {
          var expectedAction = {
            type: _types.EntityActionType.SUCCESS,
          };
          var action = (0, _actions.makeActionCreator)(_types.EntityActionType.SUCCESS);
          expect(action()).toEqual(expectedAction);
        });
        it('should return an object containing the action type, and the payload keys', function () {
          var _payload;

          var key1 = 'foo';
          var key2 = 'bar';
          var value1 = 'bar';
          var value2 = 'qux';
          var expectedAction = {
            type: _types.EntityActionType.SUCCESS,
            payload:
              ((_payload = {}),
              _defineProperty(_payload, key1, value1),
              _defineProperty(_payload, key2, value2),
              _payload),
          };
          var action = (0, _actions.makeActionCreator)(_types.EntityActionType.SUCCESS, key1, key2);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
    describe('makeEntityActionCreator', function () {
      var entity = 'foo';
      it('should be a function', function () {
        expect(_typeof(_actions.makeEntityActionCreator)).toEqual('function');
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.makeEntityActionCreator)(_types.EntityActionType.SUCCESS, entity))).toEqual(
          'function'
        );
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.makeEntityActionCreator)();
        }).toThrow(typeError);
      });
      it('should throw an error if entity is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.makeEntityActionCreator)(_types.EntityActionType.SUCCESS);
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return an object containing the action type', function () {
          var expectedAction = {
            type: _types.EntityActionType.SUCCESS,
            entity: entity,
          };
          var action = (0, _actions.makeEntityActionCreator)(_types.EntityActionType.SUCCESS, entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return an object containing the action type, and the payload keys', function () {
          var _payload2;

          var key1 = 'foo';
          var key2 = 'bar';
          var value1 = 'bar';
          var value2 = 'qux';
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.SUCCESS,
            payload:
              ((_payload2 = {}),
              _defineProperty(_payload2, key1, value1),
              _defineProperty(_payload2, key2, value2),
              _payload2),
          };
          var action = (0, _actions.makeEntityActionCreator)(_types.EntityActionType.SUCCESS, entity, key1, key2);
          expect(action(value1, value2)).toEqual(expectedAction);
        });
      });
    });
  });
  describe('Action Types', function () {
    var entity = 'foo';
    describe('Request', function () {
      it('should be a function', function () {
        expect(_typeof(_actions.fetchRequestCreator)).toEqual('function');
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.fetchRequestCreator)(entity))).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.fetchRequestCreator)();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a request action to be dispatched', function () {
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.REQUEST,
          };
          var action = (0, _actions.fetchRequestCreator)(entity);
          expect(action()).toEqual(expectedAction);
        });
      });
    });
    describe('Success', function () {
      it('should be a function', function () {
        expect(_typeof(_actions.fetchSuccessCreator)).toEqual('function');
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.fetchSuccessCreator)(entity))).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.fetchSuccessCreator)();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a success action to be dispatched, with an empty payload', function () {
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.SUCCESS,
            payload: {
              data: undefined,
              append: undefined,
              lastUpdated: undefined,
            },
          };
          var action = (0, _actions.fetchSuccessCreator)(entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return a success action to be dispatched, with a proper payload', function () {
          var lastUpdated = new Date();
          var data = ['123'];
          var append = true;
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.SUCCESS,
            payload: {
              data: data,
              append: append,
              lastUpdated: lastUpdated,
            },
          };
          var action = (0, _actions.fetchSuccessCreator)(entity);
          expect(action(data, lastUpdated, append)).toEqual(expectedAction);
        });
      });
    });
    describe('Failure', function () {
      it('should be a function', function () {
        expect(_typeof(_actions.fetchFailureCreator)).toEqual('function');
      });
      it('should return a function', function () {
        expect(_typeof((0, _actions.fetchFailureCreator)(entity))).toEqual('function');
      });
      it('should throw an error if a type is not passed', function () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(function () {
          return (0, _actions.fetchFailureCreator)();
        }).toThrow(entityError);
      });
      describe('Invoking the returned function', function () {
        it('should return a failure action to be dispatched, with an empty payload', function () {
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.FAILURE,
            payload: {
              error: undefined,
              lastUpdated: undefined,
            },
          };
          var action = (0, _actions.fetchFailureCreator)(entity);
          expect(action()).toEqual(expectedAction);
        });
        it('should return a failure action to be dispatched, with a proper payload', function () {
          var lastUpdated = new Date();
          var error = new Error('API Error');
          var expectedAction = {
            entity: entity,
            type: _types.EntityActionType.FAILURE,
            payload: {
              error: error,
              lastUpdated: lastUpdated,
            },
          };
          var action = (0, _actions.fetchFailureCreator)(entity);
          expect(action(error, lastUpdated)).toEqual(expectedAction);
        });
      });
    });
  });
});

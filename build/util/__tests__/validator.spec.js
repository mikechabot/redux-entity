'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var validator_1 = require('../validator');
var types_1 = require('../../types');
describe('validate', function () {
  it('should be a function', function () {
    expect(typeof validator_1.validate).toEqual('function');
  });
  describe('Empty Arguments', function () {
    it('should return undefined when no arguments are passed', function () {
      // @ts-ignore
      expect(validator_1.validate()).toBeUndefined();
    });
    it('should return undefined when no arguments are null', function () {
      expect(validator_1.validate(null)).toBeUndefined();
    });
    it('should return undefined when no arguments are undefined', function () {
      expect(validator_1.validate(undefined)).toBeUndefined();
    });
    it('should return undefined if an empty object is passed', function () {
      expect(validator_1.validate({})).toBeUndefined();
    });
  });
  describe('Bad Option Types', function () {
    var invalidType = new Error(
      'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options'
    );
    it('should throw an error if a string is passed', function () {
      expect(function () {
        return validator_1.validate('foo');
      }).toThrow(invalidType);
    });
    it('should throw an error if a number is passed', function () {
      expect(function () {
        return validator_1.validate(123);
      }).toThrow(invalidType);
    });
    it('should throw an error if an array is passed', function () {
      expect(function () {
        return validator_1.validate([]);
      }).toThrow(invalidType);
    });
    it('should throw an error if a function is passed', function () {
      expect(function () {
        return validator_1.validate(function () {});
      }).toThrow(invalidType);
    });
  });
  describe('Option Key Validation', function () {
    it('should not throw and error if the option key is not recognized', function () {
      var error = new Error('Unexpected top-level option: foo');
      var invalidOptions = { append: true };
      expect(function () {
        return validator_1.validate(invalidOptions);
      }).not.toThrow();
    });
    it('should throw and error if the option key is not recognized', function () {
      var error = new Error('Unexpected top-level option: foo');
      var invalidOptions = { foo: 'bar' };
      expect(function () {
        return validator_1.validate(invalidOptions);
      }).toThrow(error);
    });
    describe('Append', function () {
      var error = new Error('Invalid type for "' + types_1.OptionKey.Append + ', expected "boolean"');
      it('should not throw an error if "append" is a boolean', function () {
        var options = { append: true };
        expect(function () {
          return validator_1.validate(options);
        }).not.toThrow();
        options.append = false;
        expect(function () {
          return validator_1.validate(options);
        }).not.toThrow();
      });
      it('should throw an error if "append" is null', function () {
        var options = { append: null };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is undefined', function () {
        var options = { append: undefined };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a string', function () {
        var options = { append: 'foo' };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a number', function () {
        var options = { append: 12.2 };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is an object', function () {
        var options = { append: {} };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is an array', function () {
        var options = { append: [] };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a function', function () {
        var options = { append: function () {} };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
    });
    describe('Silent', function () {
      var error = new Error('Invalid type for "' + types_1.OptionKey.Silent + ', expected "boolean"');
      it('should not throw an error if "silent" is a boolean', function () {
        var options = { silent: true };
        expect(function () {
          return validator_1.validate(options);
        }).not.toThrow();
        options.silent = false;
        expect(function () {
          return validator_1.validate(options);
        }).not.toThrow();
      });
      it('should throw an error if "silent" is null', function () {
        var options = { silent: null };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is undefined', function () {
        var options = { silent: undefined };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a string', function () {
        var options = { silent: 'foo' };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a number', function () {
        var options = { silent: 12.2 };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is an object', function () {
        var options = { silent: {} };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is an array', function () {
        var options = { silent: [] };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a function', function () {
        var options = { silent: function () {} };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
    });
    describe('Processors', function () {
      var error = new Error('Invalid type for ' + types_1.OptionKey.Processors + ', expected "object"');
      it('should not throw an error if "processors" is an object', function () {
        var options = { processors: {} };
        expect(function () {
          return validator_1.validate(options);
        }).not.toThrow();
      });
      it('should throw an error if "processors" is null', function () {
        var options = { processors: null };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is undefined', function () {
        var options = { processors: undefined };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a string', function () {
        var options = { processors: 'foo' };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a number', function () {
        var options = { processors: 12.2 };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is an array', function () {
        var options = { processors: [] };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a function', function () {
        var options = { processors: function () {} };
        expect(function () {
          return validator_1.validate(options);
        }).toThrow(error);
      });
      describe('Processor Types', function () {
        it('should throw an error if an unknown processorType is passed', function () {
          var error = new Error('Invalid processorType: "foo"');
          var options = { processors: { foo: 'bar' } };
          expect(function () {
            return validator_1.validate(options);
          }).toThrow(error);
        });
        it('should throw an error if a known processorType is not a function', function () {
          var _a;
          var error = new Error('Expected function for processorType, but found "number"');
          var options = { processors: ((_a = {}), (_a[types_1.ProcessorType.BeforeFailure] = 123), _a) };
          expect(function () {
            return validator_1.validate(options);
          }).toThrow(error);
        });
        it('should not throw an error if a known processorType is a function', function () {
          var _a;
          var error = new Error('Expected function for processorType, but found "number"');
          var options = { processors: ((_a = {}), (_a[types_1.ProcessorType.BeforeFailure] = function () {}), _a) };
          expect(validator_1.validate(options)).toBeUndefined();
        });
      });
    });
  });
});

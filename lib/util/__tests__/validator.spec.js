'use strict';

var _validator = require('../validator');

var _types = require('../../types');

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

describe('validate', function () {
  it('should be a function', function () {
    expect(_typeof(_validator.validate)).toEqual('function');
  });
  describe('Empty Arguments', function () {
    it('should return undefined when no arguments are passed', function () {
      // @ts-ignore
      expect((0, _validator.validate)()).toBeUndefined();
    });
    it('should return undefined when no arguments are null', function () {
      expect((0, _validator.validate)(null)).toBeUndefined();
    });
    it('should return undefined when no arguments are undefined', function () {
      expect((0, _validator.validate)(undefined)).toBeUndefined();
    });
    it('should return undefined if an empty object is passed', function () {
      expect((0, _validator.validate)({})).toBeUndefined();
    });
  });
  describe('Bad Option Types', function () {
    var invalidType = new Error(
      'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options'
    );
    it('should throw an error if a string is passed', function () {
      expect(function () {
        return (0, _validator.validate)('foo');
      }).toThrow(invalidType);
    });
    it('should throw an error if a number is passed', function () {
      expect(function () {
        return (0, _validator.validate)(123);
      }).toThrow(invalidType);
    });
    it('should throw an error if an array is passed', function () {
      expect(function () {
        return (0, _validator.validate)([]);
      }).toThrow(invalidType);
    });
    it('should throw an error if a function is passed', function () {
      expect(function () {
        return (0, _validator.validate)(function () {});
      }).toThrow(invalidType);
    });
  });
  describe('Option Key Validation', function () {
    it('should not throw and error if the option key is not recognized', function () {
      var error = new Error('Unexpected top-level option: foo');
      var invalidOptions = {
        append: true,
      };
      expect(function () {
        return (0, _validator.validate)(invalidOptions);
      }).not.toThrow();
    });
    it('should throw and error if the option key is not recognized', function () {
      var error = new Error('Unexpected top-level option: foo');
      var invalidOptions = {
        foo: 'bar',
      };
      expect(function () {
        return (0, _validator.validate)(invalidOptions);
      }).toThrow(error);
    });
    describe('Append', function () {
      var error = new Error('Invalid type for "'.concat(_types.OptionKey.APPEND, ', expected "boolean"'));
      it('should not throw an error if "append" is a boolean', function () {
        var options = {
          append: true,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).not.toThrow();
        options.append = false;
        expect(function () {
          return (0, _validator.validate)(options);
        }).not.toThrow();
      });
      it('should throw an error if "append" is null', function () {
        var options = {
          append: null,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is undefined', function () {
        var options = {
          append: undefined,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a string', function () {
        var options = {
          append: 'foo',
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a number', function () {
        var options = {
          append: 12.2,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is an object', function () {
        var options = {
          append: {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is an array', function () {
        var options = {
          append: [],
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "append" is a function', function () {
        var options = {
          append: function append() {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
    });
    describe('Silent', function () {
      var error = new Error('Invalid type for "'.concat(_types.OptionKey.SILENT, ', expected "boolean"'));
      it('should not throw an error if "silent" is a boolean', function () {
        var options = {
          silent: true,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).not.toThrow();
        options.silent = false;
        expect(function () {
          return (0, _validator.validate)(options);
        }).not.toThrow();
      });
      it('should throw an error if "silent" is null', function () {
        var options = {
          silent: null,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is undefined', function () {
        var options = {
          silent: undefined,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a string', function () {
        var options = {
          silent: 'foo',
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a number', function () {
        var options = {
          silent: 12.2,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is an object', function () {
        var options = {
          silent: {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is an array', function () {
        var options = {
          silent: [],
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "silent" is a function', function () {
        var options = {
          silent: function silent() {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
    });
    describe('Processors', function () {
      var error = new Error('Invalid type for '.concat(_types.OptionKey.PROCESSORS, ', expected "object"'));
      it('should not throw an error if "processors" is an object', function () {
        var options = {
          processors: {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).not.toThrow();
      });
      it('should throw an error if "processors" is null', function () {
        var options = {
          processors: null,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is undefined', function () {
        var options = {
          processors: undefined,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a string', function () {
        var options = {
          processors: 'foo',
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a number', function () {
        var options = {
          processors: 12.2,
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is an array', function () {
        var options = {
          processors: [],
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      it('should throw an error if "processors" is a function', function () {
        var options = {
          processors: function processors() {},
        };
        expect(function () {
          return (0, _validator.validate)(options);
        }).toThrow(error);
      });
      describe('Processor Types', function () {
        it('should throw an error if an unknown processorType is passed', function () {
          var error = new Error('Invalid processorType: "foo"');
          var options = {
            processors: {
              foo: 'bar',
            },
          };
          expect(function () {
            return (0, _validator.validate)(options);
          }).toThrow(error);
        });
        it('should throw an error if a known processorType is not a function', function () {
          var error = new Error('Expected function for processorType, but found "number"');
          var options = {
            processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, 123),
          };
          expect(function () {
            return (0, _validator.validate)(options);
          }).toThrow(error);
        });
        it('should not throw an error if a known processorType is a function', function () {
          var error = new Error('Expected function for processorType, but found "number"');
          var options = {
            processors: _defineProperty({}, _types.ProcessorType.BEFORE_FAILURE, function () {}),
          };
          expect((0, _validator.validate)(options)).toBeUndefined();
        });
      });
    });
  });
});

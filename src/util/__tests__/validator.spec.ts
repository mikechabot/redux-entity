import { validate } from '../validator';
import { OptionKey, ProcessorType } from '../../types';

describe('validate', () => {
  it('should be a function', () => {
    expect(typeof validate).toEqual('function');
  });

  describe('Empty Arguments', () => {
    it('should return undefined when no arguments are passed', () => {
      // @ts-ignore
      expect(validate()).toBeUndefined();
    });

    it('should return undefined when no arguments are null', () => {
      expect(validate(null)).toBeUndefined();
    });

    it('should return undefined when no arguments are undefined', () => {
      expect(validate(undefined)).toBeUndefined();
    });

    it('should return undefined if an empty object is passed', () => {
      expect(validate({})).toBeUndefined();
    });
  });

  describe('Bad Option Types', () => {
    const invalidType = new Error(
      'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options'
    );

    it('should throw an error if a string is passed', () => {
      expect(() => validate('foo')).toThrow(invalidType);
    });

    it('should throw an error if a number is passed', () => {
      expect(() => validate(123)).toThrow(invalidType);
    });

    it('should throw an error if an array is passed', () => {
      expect(() => validate([])).toThrow(invalidType);
    });

    it('should throw an error if a function is passed', () => {
      expect(() => validate(() => {})).toThrow(invalidType);
    });
  });

  describe('Option Key Validation', () => {
    it('should not throw and error if the option key is not recognized', () => {
      const error = new Error('Unexpected top-level option: foo');
      const invalidOptions = { append: true };
      expect(() => validate(invalidOptions)).not.toThrow();
    });

    it('should throw and error if the option key is not recognized', () => {
      const error = new Error('Unexpected top-level option: foo');
      const invalidOptions = { foo: 'bar' };
      expect(() => validate(invalidOptions)).toThrow(error);
    });

    describe('Append', () => {
      const error = new Error(`Invalid type for "${OptionKey.APPEND}, expected "boolean"`);

      it('should not throw an error if "append" is a boolean', () => {
        const options = { append: true };
        expect(() => validate(options)).not.toThrow();

        options.append = false;
        expect(() => validate(options)).not.toThrow();
      });

      it('should throw an error if "append" is null', () => {
        const options = { append: null };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is undefined', () => {
        const options = { append: undefined };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is a string', () => {
        const options = { append: 'foo' };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is a number', () => {
        const options = { append: 12.2 };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is an object', () => {
        const options = { append: {} };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is an array', () => {
        const options = { append: [] };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "append" is a function', () => {
        const options = { append: () => {} };
        expect(() => validate(options)).toThrow(error);
      });
    });

    describe('Silent', () => {
      const error = new Error(`Invalid type for "${OptionKey.SILENT}, expected "boolean"`);

      it('should not throw an error if "silent" is a boolean', () => {
        const options = { silent: true };
        expect(() => validate(options)).not.toThrow();

        options.silent = false;
        expect(() => validate(options)).not.toThrow();
      });

      it('should throw an error if "silent" is null', () => {
        const options = { silent: null };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is undefined', () => {
        const options = { silent: undefined };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is a string', () => {
        const options = { silent: 'foo' };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is a number', () => {
        const options = { silent: 12.2 };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is an object', () => {
        const options = { silent: {} };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is an array', () => {
        const options = { silent: [] };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "silent" is a function', () => {
        const options = { silent: () => {} };
        expect(() => validate(options)).toThrow(error);
      });
    });

    describe('Processors', () => {
      const error = new Error(`Invalid type for ${OptionKey.PROCESSORS}, expected "object"`);

      it('should not throw an error if "processors" is an object', () => {
        const options = { processors: {} };
        expect(() => validate(options)).not.toThrow();
      });

      it('should throw an error if "processors" is null', () => {
        const options = { processors: null };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "processors" is undefined', () => {
        const options = { processors: undefined };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "processors" is a string', () => {
        const options = { processors: 'foo' };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "processors" is a number', () => {
        const options = { processors: 12.2 };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "processors" is an array', () => {
        const options = { processors: [] };
        expect(() => validate(options)).toThrow(error);
      });

      it('should throw an error if "processors" is a function', () => {
        const options = { processors: () => {} };
        expect(() => validate(options)).toThrow(error);
      });

      describe('Processor Types', () => {
        it('should throw an error if an unknown processorType is passed', () => {
          const error = new Error(`Invalid processorType: "foo"`);
          const options = { processors: { foo: 'bar' } };
          expect(() => validate(options)).toThrow(error);
        });

        it('should throw an error if a known processorType is not a function', () => {
          const error = new Error(`Expected function for processorType, but found "number"`);
          const options = { processors: { [ProcessorType.BEFORE_FAILURE]: 123 } };
          expect(() => validate(options)).toThrow(error);
        });

        it('should not throw an error if a known processorType is a function', () => {
          const error = new Error(`Expected function for processorType, but found "number"`);
          const options = { processors: { [ProcessorType.BEFORE_FAILURE]: () => {} } };
          expect(validate(options)).toBeUndefined();
        });
      });
    });
  });
});

import { OptionKey, Processors, ProcessorType, ReduxEntityOptions } from '../types';

export const validate = (options: any | undefined) => {
  if (!options) return;

  if (
    typeof options === 'string' ||
    typeof options === 'number' ||
    typeof options === 'function' ||
    Array.isArray(options)
  ) {
    throw new Error(
      'Options must be an object of type ReduxEntityOptions. See https://github.com/mikechabot/redux-entity#configuration-options'
    );
  }

  const keys = Object.keys(options).forEach((key) => {
    if (!Object.values(OptionKey).includes(key as OptionKey)) {
      throw new Error(`Unexpected top-level option: ${key}`);
    }

    const type = typeof options[key];
    const value = options[key];

    if (key === OptionKey.APPEND && type !== 'boolean') {
      throw new Error(`Invalid type for "${OptionKey.APPEND}, expected "boolean"`);
    }

    if (key === OptionKey.SILENT && type !== 'boolean') {
      throw new Error(`Invalid type for "${OptionKey.SILENT}, expected "boolean"`);
    }

    if (key === OptionKey.PROCESSORS) {
      if (!value || Array.isArray(value) || type !== 'object') {
        throw new Error(`Invalid type for ${OptionKey.PROCESSORS}, expected "object"`);
      }

      const processors: Processors = value;
      const processorTypes = Object.keys(processors) as ProcessorType[];

      processorTypes.forEach((processorType) => {
        if (!Object.values(ProcessorType).includes(processorType as ProcessorType)) {
          throw new Error(`Invalid processorType: "${processorType}"`);
        }

        const processor = processors[processorType];
        if (typeof processor !== 'function') {
          throw new Error(`Expected function for processorType, but found "${typeof processor}"`);
        }
      });
    }
  });

  return;
};

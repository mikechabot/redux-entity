import { OptionKey, Processors, ProcessorType, ReduxEntityOptions } from '../types';

export default function validate(options: any) {
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

    if (key === OptionKey.APPEND && type !== 'boolean') {
      throw new Error(`Expected "boolean" but found "${type}" for "${key}"`);
    }

    if (key === OptionKey.SILENT && type !== 'boolean') {
      throw new Error(`Expected "boolean" but found "${type}" for "${key}"`);
    }

    if (key === OptionKey.PROCESSORS) {
      if (type !== 'object' || Array.isArray(options[key]) || options[key] == null || options[key] === undefined) {
        throw new Error(`Expected "boolean" but found "${typeof options[key]}" for "${key}"`);
      }

      const processors: Processors = options[key];
      const processorTypes = Object.keys(processors) as ProcessorType[];

      processorTypes.forEach((processorType) => {
        if (!Object.values(ProcessorType).includes(processorType as ProcessorType)) {
          throw new Error(`Unexpected processor type "${processorType}"`);
        }

        const processor = processors[processorType];
        if (typeof processor !== 'function') {
          throw new Error(`Expected "function" but found "${typeof processor}" for "${processorType}"`);
        }
      });
    }
  });

  return true;
}

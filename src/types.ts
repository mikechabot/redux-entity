import { Dispatch } from 'redux';

export enum ProcessorTypes {
  'beforeSuccess',
  'afterSuccess',
  'beforeFailure',
  'afterFailure',
}

export type GetState = () => any;

export type ProcessorType =
  | ProcessorTypes.beforeSuccess
  | ProcessorTypes.afterSuccess
  | ProcessorTypes.beforeFailure
  | ProcessorTypes.afterFailure;

export type Processors = {
  [key in ProcessorType]: (data: any, dispatch: Dispatch, getState: GetState) => void;
};

export interface EntityLifecycleOptions {
  silent?: boolean;
  append?: boolean;
  processors?: Processors;
}

export interface EntityLifecycleProps {
  entityName: string;
  options?: EntityLifecycleOptions;
}

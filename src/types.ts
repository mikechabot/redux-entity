import { Dispatch } from 'redux';

export type GetState = () => any;

export enum ActionType {
  /** Fetching the entity */
  REQUEST = 'FETCH_REQUEST',
  /** Promise has resolved */
  SUCCESS = 'FETCH_SUCCESS',
  /** Promise has failed */
  FAILURE = 'FETCH_FAILURE',
  /** Entity reset to initial state */
  RESET = 'RESET_ENTITY',
  /** Entity removed from redux-entity state */
  DELETE = 'DELETE_ENTITY',
}

export enum ProcessorType {
  /** Executed if the promise resolves, but before "FETCH_SUCCESS" is dispatched */
  BEFORE_SUCCESS = 'beforeSuccess',
  /** Executed if the promise resolves, but after "FETCH_SUCCESS" is dispatched */
  AFTER_SUCCESS = 'afterSuccess',
  /** Executed if the promise rejects, but before "FETCH_FAILURE" is dispatched */
  BEFORE_FAILURE = 'beforeFailure',
  /** Executed if the promise rejects, but after "FETCH_FAILURE" is dispatched */
  AFTER_FAILURE = 'afterFailure',
}

export enum PayloadKey {
  DATA = 'data',
  ERROR = 'error',
  LAST_UPDATED = 'lastUpdated',
  APPEND = 'append',
}

export interface Payload {
  /** Data for the entity */
  [PayloadKey.DATA]?: any;
  /** Timestamp indicating the last time the entity was updated */
  [PayloadKey.LAST_UPDATED]?: Date;
  /** The error returned from a rejected promise */
  [PayloadKey.ERROR]?: Error;

  /** Determine whether data is overwritten of appended in the entity state */
  [PayloadKey.APPEND]?: boolean;
}

export type Action = {
  /** The type of action being dispatched */
  type: ActionType;
  /** The entity for which the action is being dispatched */
  entity?: string;
  /** The payload of the action being dispatched */
  payload?: Payload;
};

export type Processors = {
  [key in ProcessorType]: (data: any, dispatch: Dispatch, getState: GetState) => void;
};

export enum OptionKey {
  SILENT = 'silent',
  APPEND = 'append',
  PROCESSORS = 'processors',
}

export interface ReduxEntityOptions {
  /** Controls whether the "FETCH_REQUEST" action is dispatched before executing the promise */
  [OptionKey.SILENT]?: boolean;
  /** Controls whether data is overwritten or appended during subsequent promise executions */
  [OptionKey.APPEND]?: boolean;
  /** Processor options that can be executed before/after promise resolution/reject */
  [OptionKey.PROCESSORS]?: Processors;
}

export interface ReduxEntityProps {
  /** Unique name of the entity */
  entityName: string;
  /** Options object for the entity */
  options?: ReduxEntityOptions;
}

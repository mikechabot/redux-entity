import { Action as ReduxAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export type GetState = () => ReduxEntityState;

export interface ReduxEntityState {
  [key: string]: EntityState;
}

export interface EntityState {
  data?: any;
  lastUpdated?: Date | undefined;
  isFetching: boolean;
  error?: Error;
}

export enum EntityActionType {
  /** Fetching the entity */
  Request = 'FETCH_REQUEST',
  /** Promise has resolved */
  Success = 'FETCH_SUCCESS',
  /** Promise has failed */
  Failure = 'FETCH_FAILURE',
  /** Entity reset to initial state */
  Reset = 'RESET_ENTITY',
  /** Entity removed from redux-entity state */
  Delete = 'DELETE_ENTITY',
}

export enum ProcessorType {
  /** Executed if the promise resolves, but before "FETCH_SUCCESS" is dispatched */
  BeforeSuccess = 'beforeSuccess',
  /** Executed if the promise resolves, but after "FETCH_SUCCESS" is dispatched */
  AfterSuccess = 'afterSuccess',
  /** Executed if the promise rejects, but before "FETCH_FAILURE" is dispatched */
  BeforeFailure = 'beforeFailure',
  /** Executed if the promise rejects, but after "FETCH_FAILURE" is dispatched */
  AfterFailure = 'afterFailure',
}

export enum PayloadKey {
  Data = 'data',
  Error = 'error',
  LastUpdated = 'lastUpdated',
  Append = 'append',
}

export interface Payload {
  /** Data for the entity */
  [PayloadKey.Data]?: any;
  /** Timestamp indicating the last time the entity was updated */
  [PayloadKey.LastUpdated]?: Date;
  /** The error returned from a rejected promise */
  [PayloadKey.Error]?: Error;
  /** Determine whether data is overwritten of appended in the entity state */
  [PayloadKey.Append]?: boolean;
}

export interface EntityAction extends ReduxAction {
  /** The type of action being dispatched */
  type: EntityActionType;
  /** The entity for which the action is being dispatched */
  entity?: string;
  /** The payload of the action being dispatched */
  payload?: Payload;
}

export type Processors = {
  [key in ProcessorType]?: (data: any, dispatch: ThunkDispatch<any, any, any>, getState: GetState) => void;
};

export enum OptionKey {
  Silent = 'silent',
  Append = 'append',
  Processors = 'processors',
}

export interface ReduxEntityOptions {
  /** Controls whether the "FETCH_REQUEST" action is dispatched before executing the promise */
  [OptionKey.Silent]?: boolean;
  /** Controls whether data is overwritten or appended during subsequent promise executions */
  [OptionKey.Append]?: boolean;
  /** Processor options that can be executed before/after promise resolution/reject */
  [OptionKey.Processors]?: Processors;
}

export interface ReduxEntityProps {
  /** Unique name of the entity */
  entityName: string;
  /** Options object for the entity */
  options?: ReduxEntityOptions;
}

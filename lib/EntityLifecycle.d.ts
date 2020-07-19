import { Dispatch } from 'redux';
import { ReduxEntityProps, ProcessorType, GetState } from './types';
declare class EntityLifecycle {
  private readonly entityName;
  private readonly append;
  readonly silent: boolean;
  private readonly processors;
  constructor({ entityName, options }: ReduxEntityProps);
  /**
   * Execute if the promise resolves
   * @param data
   * @param dispatch
   * @param getState
   */
  onSuccess(data: any, dispatch: Dispatch, getState: GetState): any;
  /**
   * Execute if the promise rejects
   * @param error
   * @param dispatch
   * @param getState
   */
  onFailure(error: any, dispatch: Dispatch, getState: GetState): Error;
  /**
   * Process a stage of a given type
   * @param processorType
   * @param data
   * @param dispatch
   * @param getState
   */
  processStage(processorType: ProcessorType, data: any, dispatch: Dispatch, getState: GetState): any;
}
export default EntityLifecycle;

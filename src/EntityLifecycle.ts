import { Dispatch } from 'redux';

import { fetchSuccessCreator, fetchFailureCreator } from './actions';
import { Processors, ReduxEntityProps, ProcessorType, GetState } from './types';

class EntityLifecycle {
  private readonly entityName: string;
  private readonly append: boolean;
  public readonly silent: boolean;
  private readonly processors: Processors;

  constructor({ entityName, options }: ReduxEntityProps) {
    this.entityName = entityName;
    this.append = options?.append || false;
    this.silent = options?.silent || false;
    this.processors = options?.processors || ({} as Processors);
  }

  /**
   * Execute if the promise resolves
   * @param data
   * @param dispatch
   * @param getState
   */
  onSuccess(data: any, dispatch: Dispatch, getState: GetState): any {
    /**
     * Process the "beforeSuccess" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the success message
     */
    const dispatchedData = this.processStage(ProcessorType.BeforeSuccess, data, dispatch, getState);
    /**
     * Create and dispatch the success action
     */
    const successAction = fetchSuccessCreator(this.entityName);
    dispatch(successAction(dispatchedData, new Date(), this.append));
    /**
     * Process the "afterSuccess" stage, which is invoked after the success
     * action has been dispatched.
     */
    this.processStage(ProcessorType.AfterSuccess, dispatchedData, dispatch, getState);
    /**
     * Return the mutated data
     */
    return dispatchedData;
  }

  /**
   * Execute if the promise rejects
   * @param error
   * @param dispatch
   * @param getState
   */
  onFailure(error: any, dispatch: Dispatch, getState: GetState): Error {
    /**
     * Process the "beforeFailure" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the error message
     */
    const dispatchedError = this.processStage(ProcessorType.BeforeFailure, error, dispatch, getState);
    /**
     * Create and dispatch the failure action
     */
    const failureAction = fetchFailureCreator(this.entityName);
    dispatch(failureAction(dispatchedError, new Date()));
    /**
     * Process the "afterFailure" stage, which is invoked after the failure
     * action has been dispatched.
     */
    this.processStage(ProcessorType.AfterFailure, dispatchedError, dispatch, getState);

    return dispatchedError;
  }

  /**
   * Process a stage of a given type
   * @param processorType
   * @param data
   * @param dispatch
   * @param getState
   */
  processStage(processorType: ProcessorType, data: any, dispatch: Dispatch, getState: GetState): any {
    if (!processorType) {
      throw new Error('Missing required processorType');
    }
    /**
     * If the processor exists, execute it, and returned
     * the processed data.
     */
    const processor = this.processors[processorType];
    if (processor && typeof processor === 'function') {
      return processor(data, dispatch, getState);
    }

    return data;
  }
}

export default EntityLifecycle;

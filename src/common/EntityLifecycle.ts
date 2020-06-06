import { Dispatch } from 'redux';

import { fetchRequestCreator, fetchSuccessCreator, fetchFailureCreator } from '../actions';
import { Processors, EntityLifecycleProps, ProcessorTypes, GetState, ProcessorType } from '../types';

class EntityLifecycle {
  private readonly entityName: string;
  private readonly append: boolean;
  private readonly silent: boolean;
  private readonly processors: Processors;

  constructor({ entityName, options = {} }: EntityLifecycleProps) {
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
  onSuccess(data: any, dispatch: Dispatch, getState: GetState) {
    /**
     * Process the "beforeSuccess" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the success message
     */
    const dispatchedData = this.processStage(ProcessorTypes.beforeSuccess, data, dispatch, getState);
    /**
     * Create and dispatch the success action
     */
    const successAction = fetchSuccessCreator(this.entityName);
    dispatch(successAction(dispatchedData, Date.now(), this.append));
    /**
     * Process the "afterSuccess" stage, which is invoked after the success
     * action has been dispatched.
     */
    this.processStage(ProcessorTypes.afterSuccess, data, dispatch, getState);
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
  onFailure(error: any, dispatch: Dispatch, getState: GetState) {
    /**
     * Process the "beforeFailure" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the error message
     */
    const dispatchedError = this.processStage(ProcessorTypes.beforeFailure, error, dispatch, getState);
    /**
     * Create and dispatch the failure action
     */
    const failureAction = fetchFailureCreator(this.entityName);
    dispatch(failureAction(error, Date.now()));
    /**
     * Process the "afterFailure" stage, which is invoked after the failure
     * action has been dispatched.
     */
    this.processStage(ProcessorTypes.afterFailure, error, dispatch, getState);

    return dispatchedError;
  }

  /**
   * Process a stage of a given type
   * @param processorType
   * @param data
   * @param dispatch
   * @param getState
   */
  processStage(processorType: ProcessorType, data: any, dispatch: Dispatch, getState: GetState) {
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

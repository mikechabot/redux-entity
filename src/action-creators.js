import { makeActionCreator, makeEntityActionCreator } from './common/action-creators';
import { ACTION_TYPES, ENTITY_PROPS, ACTION_PROPS } from './common/entity-const';

const actionCreators = {
  resetEntity: makeActionCreator(
    ACTION_TYPES.RESET_ENTITY,
    ACTION_PROPS.ENTITY,
    ENTITY_PROPS.LAST_UPDATED
  ),
  deleteEntity: makeActionCreator(
    ACTION_TYPES.DELETE_ENTITY,
    ACTION_PROPS.ENTITY
  ),
  /**
   * Action creator for fetch requests
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchRequest: entity => makeEntityActionCreator(
    ACTION_TYPES.FETCH_REQUEST,
    entity
  ),
  /**
   * Action creator for API fetch successes
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchSuccess: entity => makeEntityActionCreator(
    ACTION_TYPES.FETCH_SUCCESS,
    entity,
    ENTITY_PROPS.DATA,
    ENTITY_PROPS.LAST_UPDATED,
    ACTION_PROPS.APPEND
  ),
  /**
   * Action creator for API fetch failures
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchFailure: entity => makeEntityActionCreator(
    ACTION_TYPES.FETCH_FAILURE,
    entity,
    ENTITY_PROPS.ERROR,
    ENTITY_PROPS.LAST_UPDATED
  )
};

export default actionCreators;

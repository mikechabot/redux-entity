import { ACTION_TYPES, ENTITY_PROPS, ACTION_PROPS } from './const';

/**
 * Generate a Redux action object
 * @param action
 * @param keys
 * @param args
 * @returns {*}
 * @private
 */
const generateAction = (action, keys, values) => {
  const generatedAction = Object.assign({}, action);
  keys.forEach((arg, index) => {
    generatedAction[keys[index]] = values[index];
  });
  return generatedAction;
};

/**
 * Generate action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const myActionType = 'DO_IT';
 *            const doItAction = makeActionCreator(myActionType, 'data');
 *            doItAction(123); --> { type: "DO_IT", data: 123 }
 *
 * @param type
 * @returns {Function}
 */
export const makeActionCreator = (type, ...keys) => {
  if (!type) throw new Error('Type cannot be null/undefined');
  return function (...values) {
    return generateAction({ type }, keys, values);
  };
};

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type              Redux action type
 * @param entity            Model entity name (e.g 'users', 'orders', 'foobar')
 * @returns {Function}      Action creator that contains an entity key
 */
export const makeEntityActionCreator = (type, entity, ...keys) => {
  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function (...values) {
    return generateAction({ type, entity }, keys, values);
  };
};

export const resetEntity = makeActionCreator(ACTION_TYPES.RESET_ENTITY, ACTION_PROPS.ENTITY, ENTITY_PROPS.LAST_UPDATED);

export const deleteEntity = makeActionCreator(ACTION_TYPES.DELETE_ENTITY, ACTION_PROPS.ENTITY);

/**
 * Action creator for fetch requests
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchRequestCreator = (entity) => makeEntityActionCreator(ACTION_TYPES.FETCH_REQUEST, entity);

/**
 * Action creator for API fetch successes
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchSuccessCreator = (entity) =>
  makeEntityActionCreator(
    ACTION_TYPES.FETCH_SUCCESS,
    entity,
    ENTITY_PROPS.DATA,
    ENTITY_PROPS.LAST_UPDATED,
    ACTION_PROPS.APPEND
  );

/**
 * Action creator for API fetch failures
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchFailureCreator = (entity) =>
  makeEntityActionCreator(ACTION_TYPES.FETCH_FAILURE, entity, ENTITY_PROPS.ERROR, ENTITY_PROPS.LAST_UPDATED);

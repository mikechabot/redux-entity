import { Action, ActionType, Payload, PayloadKey } from './types';

const ENTITY = 'entity';

/**
 * Generate a Redux action object
 * @param action
 * @param keys
 * @param values
 */
const generateAction = (action: Action, keys: PayloadKey[], values: any) => {
  const generatedAction: Action = { ...action };
  if (keys && keys.length > 0) {
    const payload: Payload = {};
    keys.forEach((arg: any, index: number) => {
      payload[keys[index]] = values[index];
    });
    generatedAction.payload = payload;
  }
  return generatedAction;
};

/**
 * Generate action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const type = 'DO_IT';
 *            const action = makeActionCreator(type, 'data');
 *            action(123); --> { type, data: 123 }
 *
 * @param type  Redux action type
 * @param keys  Additional keys to append to the payload
 */
export const makeActionCreator = (type: ActionType, ...keys: PayloadKey[]) => {
  if (!type) throw new Error('Type cannot be null/undefined');
  return function (...values: any) {
    return generateAction({ type }, keys, values);
  };
};

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type    Redux action type
 * @param entity  Model entity name (e.g 'users', 'orders', 'foobar')
 * @param keys    Additional keys to append to the payload
 */
export const makeEntityActionCreator = (type: ActionType, entity: string, ...keys: PayloadKey[]) => {
  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function (...values: any) {
    return generateAction({ type, entity }, keys, values);
  };
};

/**
 * Action creator for fetch requests
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export const fetchRequestCreator = (entity: string) => makeEntityActionCreator(ActionType.REQUEST, entity);

/**
 * Action creator for API fetch successes
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export const fetchSuccessCreator = (entity: string) =>
  makeEntityActionCreator(ActionType.SUCCESS, entity, PayloadKey.DATA, PayloadKey.LAST_UPDATED, PayloadKey.APPEND);

/**
 * Action creator for API fetch failures
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export const fetchFailureCreator = (entity: string) =>
  makeEntityActionCreator(ActionType.FAILURE, entity, PayloadKey.ERROR, PayloadKey.LAST_UPDATED);

export const ResetEntity = makeEntityActionCreator(ActionType.RESET, ENTITY, PayloadKey.LAST_UPDATED);
export const DeleteEntity = makeEntityActionCreator(ActionType.DELETE, ENTITY);

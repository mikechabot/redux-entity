import { PayloadKeys, EntityAction, EntityActionType, Payload, Entity } from './types';

/**
 * Generate a Redux action object
 * @param action
 * @param keys
 * @param values
 */
const generateAction = (action: EntityAction, keys: PayloadKeys[], values: any): EntityAction => {
  const generatedAction: EntityAction = { ...action };
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
 * treated as the Redux action type; the second argument to be the name of an entity.
 * All other passed arguments are treated as property on the action object itself.
 *
 *   Example: const type = 'DO_IT';
 *            const action = makeActionCreator(type, 'orders', 'data');
 *            action(123); --> { type, entity: 'orders', data: 123 }
 *
 * @param type    Redux action type
 * @param entity  Model entity name (e.g 'users', 'orders', 'foobar')
 * @param keys    Additional keys to append to the payload
 */
export const makeEntityActionCreator = (type: EntityActionType, entity: string, ...keys: PayloadKeys[]) => {
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
export const fetchRequestCreator = (entity: string) => makeEntityActionCreator(EntityActionType.Request, entity);

/**
 * Action creator for API fetch successes
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export const fetchSuccessCreator = (entity: string) =>
  makeEntityActionCreator(
    EntityActionType.Success,
    entity,
    PayloadKeys.Data,
    PayloadKeys.LastUpdated,
    PayloadKeys.Append
  );

/**
 * Action creator for API fetch failures
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export const fetchFailureCreator = (entity: string) =>
  makeEntityActionCreator(EntityActionType.Failure, entity, PayloadKeys.Error, PayloadKeys.LastUpdated);

export const ResetEntity = (entity: string) =>
  makeEntityActionCreator(EntityActionType.Reset, entity, PayloadKeys.LastUpdated)(new Date());

export const DeleteEntity = (entity: string) => makeEntityActionCreator(EntityActionType.Delete, entity)();

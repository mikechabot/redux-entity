import { PayloadKeys, EntityAction, EntityActionType } from './types';
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
export declare const makeEntityActionCreator: (
  type: EntityActionType,
  entity: string,
  ...keys: PayloadKeys[]
) => (...values: any) => EntityAction;
/**
 * Action creator for fetch requests
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export declare const fetchRequestCreator: (entity: string) => (...values: any) => EntityAction;
/**
 * Action creator for API fetch successes
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export declare const fetchSuccessCreator: (entity: string) => (...values: any) => EntityAction;
/**
 * Action creator for API fetch failures
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
export declare const fetchFailureCreator: (entity: string) => (...values: any) => EntityAction;
export declare const ResetEntity: (entity: string, lastUpdated?: Date) => EntityAction;
export declare const DeleteEntity: (entity: string) => EntityAction;

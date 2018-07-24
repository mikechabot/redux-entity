/**
 * Generation a Redux action object
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
export function makeActionCreator(type, ...keys) {
  if (!type) throw new Error('Type cannot be null/undefined');
  return function (...values) {
    return generateAction({ type }, keys, values);
  };
}

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type              Redux action type
 * @param entity            Model entity name (e.g 'users', 'orders', 'foobar')
 * @returns {Function}      Action creator that contains an entity key
 */
export function makeEntityActionCreator(type, entity, ...keys) {
  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function (...values) {
    return generateAction({ type, entity }, keys, values);
  };
}

import loadEntity from './thunk';
import { resetEntity, deleteEntity } from './actions';

export { default as entities } from './reducer';
export * from './types';

export default {
  Load: loadEntity,
  Reset: resetEntity,
  Delete: deleteEntity,
};

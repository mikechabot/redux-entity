import { EntityAction, EntityActionType, Payload, ReduxEntityState, EntityState } from './types';

const INITIAL_ENTITY_STATE: EntityState = {
  data: undefined,
  lastUpdated: undefined,
  isFetching: false,
  error: undefined,
};

const INITIAL_STATE: ReduxEntityState = {};

function toArray(obj: any) {
  return Array.isArray(obj) ? obj : [obj];
}

function deriveNewData(stateData: any, payload: Payload) {
  const { data, append } = payload;
  if (!append) {
    return data;
  }
  const newData: any[] = toArray(data);
  return !stateData ? newData : [...stateData, ...newData];
}

/**
 * Sub-reducer responsible for managing individual entities
 * @param state
 * @param action
 */
function entityReducer(state = INITIAL_ENTITY_STATE, action: EntityAction) {
  const { type, payload } = action;

  switch (type) {
    case EntityActionType.Request: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    case EntityActionType.Success: {
      const newData = deriveNewData(state.data, payload!);
      return {
        ...state,
        isFetching: false,
        lastUpdated: payload!.lastUpdated,
        data: newData,
        error: null,
      };
    }
    case EntityActionType.Failure: {
      return {
        ...state,
        isFetching: false,
        lastUpdated: payload!.lastUpdated,
        data: null,
        error: payload!.error,
      };
    }
    case EntityActionType.Reset: {
      return {
        ...INITIAL_ENTITY_STATE,
        lastUpdated: payload!.lastUpdated,
      };
    }
    default: {
      return state;
    }
  }
}

/**
 * Root reducer responsible for managing multiple entities
 * @param state
 * @param action
 */
export default function entities(state = INITIAL_STATE, action: EntityAction) {
  const { type, entity } = action;
  switch (type) {
    case EntityActionType.Reset: // fall through
    case EntityActionType.Success: // fall through
    case EntityActionType.Failure: // fall through
    case EntityActionType.Request: {
      return {
        ...state,
        [entity!]: entityReducer(state[entity!], action),
      };
    }
    case EntityActionType.Delete: {
      const newState = { ...state };
      delete newState[entity!];
      return newState;
    }
    default: {
      return state;
    }
  }
}

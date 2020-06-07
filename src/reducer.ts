import { Action, ActionType, Payload } from './types';

interface EntityState {
  data?: any;
  lastUpdated?: Date | undefined;
  isFetching: boolean;
  error?: Error;
}

const INITIAL_ENTITY_STATE: EntityState = {
  data: undefined,
  lastUpdated: undefined,
  isFetching: false,
  error: undefined,
};

interface InitialState {
  [key: string]: EntityState;
}

const INITIAL_STATE: InitialState = {};

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
function entityReducer(state = INITIAL_ENTITY_STATE, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ActionType.REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    case ActionType.SUCCESS: {
      const newData = deriveNewData(state.data, payload!);
      return {
        ...state,
        isFetching: false,
        lastUpdated: payload!.lastUpdated,
        data: newData,
        error: null,
      };
    }
    case ActionType.FAILURE: {
      return {
        ...state,
        isFetching: false,
        lastUpdated: payload!.lastUpdated,
        data: null,
        error: payload!.error,
      };
    }
    case ActionType.RESET: {
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
export default function entities(state = INITIAL_STATE, action: Action) {
  const { type, entity } = action;
  switch (type) {
    case ActionType.RESET: // fall through
    case ActionType.SUCCESS: // fall through
    case ActionType.FAILURE: // fall through
    case ActionType.REQUEST: {
      return {
        ...state,
        [entity!]: entityReducer(state[entity!], action),
      };
    }
    case ActionType.DELETE: {
      const newState = { ...state };
      delete newState[entity!];
      return newState;
    }
    default: {
      return state;
    }
  }
}

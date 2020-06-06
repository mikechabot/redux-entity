import { ACTION_TYPES, INITIAL_ENTITY_STATE } from './const';

function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

function entity(state = INITIAL_ENTITY_STATE, action) {
  switch (action.type) {
    case ACTION_TYPES.FETCH_REQUEST: {
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    }
    case ACTION_TYPES.FETCH_SUCCESS: {
      let newData;
      if (action.append !== true) {
        newData = action.data;
      } else if (!state.data) {
        newData = toArray(action.data);
      } else {
        newData = [...state.data, ...toArray(action.data)];
      }

      return {
        ...state,
        isFetching: false,
        lastUpdated: action.lastUpdated,
        data: newData,
        error: null,
      };
    }
    case ACTION_TYPES.FETCH_FAILURE: {
      return {
        ...state,
        isFetching: false,
        lastUpdated: action.lastUpdated,
        data: null,
        error: action.error,
      };
    }
    case ACTION_TYPES.RESET_ENTITY: {
      return {
        ...INITIAL_ENTITY_STATE,
        lastUpdated: action.lastUpdated,
      };
    }
    default: {
      return state;
    }
  }
}

export default function entities(state = {}, action) {
  switch (action.type) {
    case ACTION_TYPES.RESET_ENTITY: // fall through
    case ACTION_TYPES.FETCH_SUCCESS: // fall through
    case ACTION_TYPES.FETCH_FAILURE: // fall through
    case ACTION_TYPES.FETCH_REQUEST: {
      return Object.assign({}, state, {
        [action.entity]: entity(state[action.entity], action),
      });
    }
    case ACTION_TYPES.DELETE_ENTITY: {
      const newState = Object.assign({}, state);
      delete newState[action.entity];
      return newState;
    }
    default: {
      return state;
    }
  }
}

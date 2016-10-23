# redux-entity
A redux reducer (model), and a thunk action creator (loadEntity).

## Reducer
- Store data on `state.model` associated to a key of your choice!
- Each entity is automatically wrapped with the properties below:

| Property     | Description                                     |
|-------------:|:------------------------------------------------|
| `data`       | The result of the promise, if successful        |
| `error`      | The result of the promise, if rejected          |
| `lastUpdated`| The date/time that the entity was last modified |
| `isFetching` | Whether or not the data promise is pending      |


### Model reducer
Every action dispatched by `loadEntity` is piped through the `model` reducer. And using reducer composition, the action is further piped to the `entity()` reducer to handle the state of the individual entity (i.e. `orders`, `products`, etc). 
- The only action not passed along to the `entity()` reducer is `DELETE_ENTITY`.
- `DELETE_ENTITY` deletes the object from `state.model`.

```javascript
function model(state = INITIAL_STATE, action) {
    switch(action.type) {
        case RESET_ENTITY:  // fall through
        case FETCH_SUCCESS: // fall through
        case FETCH_FAILURE: // fall through
        case FETCH_REQUEST: {
            return Object.assign(state, {
                [action.entity]: entity(
                    state[action.entity],
                    action
                )
            });
        }
        case DELETE_ENTITY: {
            delete state[action.entity];
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
};
```
#### Reducer (mode


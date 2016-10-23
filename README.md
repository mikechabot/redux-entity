# redux-entity
A redux reducer (model), and a thunk action creator (loadEntity).

## Using `redux-entity`

1. **Configure the reducer**: Import the reducer from `redux-entity`, and use it with `combineReducers()`:

```javascript
import { combineReducers } from 'redux';
import { reducer } from 'redux-entity';

export default combineReducers({
    ...<your other reducers>,
    model: reducer
});
```
2. **Create a custom thunk**: Import `loadEntity()` from `redux-entity` along with your domain service, and define a key (e.g. `orders`) that will be associated with the given promise.

```javascript
import { loadEntity } from 'redux-entity';
import MyService from './services/my-service';

export function loadOrders() {
    return loadEntity(
        'orders',
        MyService.getOrders()
    );
}
```

2. **Create a React component**:
   1. Import your thunk, and `connect()` your component to `redux`.
   2. Map your thunk (`loadOrders`) to `mapDispatchToProps`.
   3. Map your entity (`orders`) to `mapStateToProps`.
   4. Invoke your thunk in `componentDidMount`.
   5. Configure `componentWillReceiveProps` to take advantage of `state` changes.
   
```javascript
import React from 'react';
import { loadOrders } from '../redux/thunks';
import { connect } from 'react-redux';

class Orders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: null
        }
    }

    componentDidMount() {
        this.props.loadOrders();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            orders: nextProps.orders
        })
    }

    render() {

        if (!this.state.orders) return <span />;
        const { error, data, isFetching } = this.state.orders;

        if (isFetching) {
            return <span>Loading!</span>;
        } else if (error) {
            return <span>{ error.message }</span>
        }

        return (
            <ul>
                { data.map((order, index) =>
                    <li key={index}> {order.label}</li>
                )}
            </ul>
        )
    }
}

export default connect(
    state => ({orders: state.model && state.model.orders}),
    { loadOrders }
)(Orders);
```

## Reducer
- Store data on `state.model` associated to a key of your choice.
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


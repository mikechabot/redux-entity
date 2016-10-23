# redux-entity

`redux-entity` seeks to provide a scalable and predictable approach to maintaing domain entities in the Redux store. It's comprised of a **reduce**r and a **thunk**:

### Reducer
- The reducer allocates itself in the store as `state.model`.
- Each entity you load is stored on `model` with a key of your choice (e.g. `orders`), and automatically wrapped with the properties below:

| Property     | Description                                     |
|-------------:|:------------------------------------------------|
| `data`       | The result of the promise, if successful        |
| `error`      | The result of the promise, if rejected          |
| `lastUpdated`| The date/time that the entity was last modified |
| `isFetching` | Whether or not the data promise is pending      |

#### Example redux store
```javascript
const state = {
    model: {
        orders: {
            isFetching: false,
            lastUpdated: 1477198033629,
            data: [
                { id: 0, name: 'Oreos' }, 
                { id: 2, name: 'Doritos' }, 
                ...
            ]
        }
    },
    ...
}
```
#### `model` reducer
- Every action dispatched by the **thunk** will be consumed by the `model` reducer. 
- Most actions will also be piped through the `entity` reducer which handles an individual entity (e.g. `orders`) on `model`:
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
#### `entity` reducer
Handles the state of a single entity (e.g. `orders`):
```javascript
function entity(state = INITIAL_ENTITY_STATE, action) {
    switch(action.type) {
        case FETCH_REQUEST: {
            return Object.assign(state, {
                isFetching: true,
                error: null
            });
        }
        case FETCH_SUCCESS: {
            return Object.assign(state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: action.data,
                error: null
            });
        }
        case FETCH_FAILURE: {
            return Object.assign(state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: null,
                error: action.error
            });
        }
        case RESET_ENTITY: {
            return Object.assign(INITIAL_ENTITY_STATE, {
                lastUpdated: action.lastUpdated
            });
        }
        default: {
            return state;
        }
    }
}
```

#### Thunk
- The thunk (`loadEntity(entityName, promise)`) accepts your entity key name and your data promise (e.g. `MyService.getOrders()`)

## Using `redux-entity`
**Configure the reducer**: Import the reducer from `redux-entity`, and use it with `combineReducers()`:
```javascript
// root-reducer.js
import { combineReducers } from 'redux';
import { reducer } from 'redux-entity';

export default combineReducers({
    ...<your other reducers>,
    model: reducer
});
```
**Create a custom thunk**: Import `loadEntity()` from `redux-entity` along with your domain service, and define a key (e.g. `orders`) that will be associated with the given promise.
```javascript
// thunks.js
import { loadEntity } from 'redux-entity';
import MyService from './services/my-service';

export function loadOrders() {
    return loadEntity(
        'orders',
        MyService.getOrders()
    );
}
```
**Create a React component**:
   1. Import your thunk, and `connect()` your component to `redux`.
   2. Map your thunk (`loadOrders`) to `mapDispatchToProps`.
   3. Map your entity (`orders`) to `mapStateToProps`.
   4. Invoke your thunk in `componentDidMount`.
   5. Configure `componentWillReceiveProps` to take advantage of `state` changes.   
```javascript
// Orders.jsx
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

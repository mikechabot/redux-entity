[![Build Status](https://travis-ci.org/mikechabot/redux-entity.svg?branch=master)](https://travis-ci.org/mikechabot/redux-entity)
[![Dependency Status](https://david-dm.org/mikechabot/redux-entity.svg)](https://david-dm.org/mikechabot/redux-entity)
[![Dev Dependency Status](https://david-dm.org/mikechabot/redux-entity/dev-status.svg)](https://david-dm.org/mikechabot/redux-entity?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/redux-entity/badge.svg?branch=master)](https://coveralls.io/github/mikechabot/redux-entity?branch=master)

# redux-entity

`redux-entity` seeks to provide a predictable approach to maintaining domain entities in Redux. It's comprised of a **[thunk](https://github.com/gaearon/redux-thunk#whats-a-thunk)** and a **[reducer](http://redux.js.org/docs/basics/Reducers.html)**.

- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Thunk](#thunk)
- [Reducer](#reducer)
- [Additional Actions](#additional-actions)

## Live Demo
http://mikechabot.github.io/react-boilerplate/

## <a name="redux-entity#getting-started">Getting Started</a>
###1. Installation
Using `npm` or `yarn`:
- ```$ yarn add redux-entity```
- ```$ npm -i -S redux-entity```

###2. Configure the root reducer
Import the reducer from `redux-entity`, and use it with [`combineReducers()`](http://redux.js.org/docs/api/combineReducers.html):
```javascript
// root-reducer.js
import { combineReducers } from 'redux';
import { model } from 'redux-entity';

export default combineReducers({
    ...<your other reducers>,
    model
});
```
###3. Configure the Redux store
Ensure `redux-thunk` middelware is applied, along with the root reducer from Step #1:

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root-reducer';

export default function configureStore(initialState) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
};
```

###4. Create a custom thunk
Import `loadEntity()` from `redux-entity` along with your domain service, and define an entity key (e.g. `orders`) that will be associated with the given promise.
```javascript
// thunks.js
import { loadEntity } from 'redux-entity';
import OrderService from './services/order-service';

export function loadOrders() {
    return loadEntity(
        'orders',
        OrderService.getOrders()
    );
}
```
###5. Create a React component
   1. Import your thunk, and `connect()` your component to Redux.
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
## <a name="redux-entity#thunk">Thunk</a>

- At minimum, `loadEntity` accepts a [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) for the entity name (e.g. `orders`) and a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (e.g. `OrderService.getOrders)` as arguments.
- A third arugment `silent` ([Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)) determines whether or not to dispatch the FETCH_REQUEST action. If true, the action is not dispatched.

```javascript
function loadEntity (
    name,
    promise,
    options
) {
    if (!name || typeof name !== 'string') throw new Error('name is required, and must be a String');
    if (!promise || !promise.then) throw new Error('promise is required, and must be a Promise');
    if (options && options.constructor !== Object) throw new Error('options must be an Object');

    return (dispatch) => {
        options = __mergeWithDefaultOptions(options);

        if (!options.silent) {
            dispatch(
                actionCreators.fetchRequest(name)()
            );
        }

        return promise
            .then(data => {
                dispatch(
                    actionCreators.fetchSuccess(name)(data, __now(), options.append)
                );
            })
            .catch(error => {
                dispatch(
                    actionCreators.fetchFailure(name)(error, __now())
                );
            });
    };
}
```
## <a name="redux-entity#reducer">Reducer</a>
- Each entity you load is stored on `state.model` (per Step #1 in [Getting Started](#getting-started)) with a key of your choice (e.g. `orders`), and automatically wrapped with the properties below:

| Property     | Description                                     |
|-------------:|:------------------------------------------------|
| `data`       | The result of the promise, if successful        |
| `error`      | The result of the promise, if rejected          |
| `lastUpdated`| The date/time that the entity was last modified; updates automatically. |
| `isFetching` | Whether or not the data promise is pending      |

### Example Redux store
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
### `model` reducer
- Every action dispatched by the **thunk** (`loadEntity`) will be consumed by the `model` reducer. 
- Most actions will also be piped through the `entity` reducer, which handles individual entities (e.g. `orders`) on `model`:
```javascript
function model (state, action) {
    if (!state) state = Object.assign({}, INITIAL_MODEL_STATE);
    switch (action.type) {
        case RESET_ENTITY:  // fall through
        case FETCH_SUCCESS: // fall through
        case FETCH_FAILURE: // fall through
        case FETCH_REQUEST: {
            return Object.assign({}, state, {
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
}
```
### `entity` reducer
Handles the state of a single entity (e.g. `orders`):
```javascript
function entity (state, action) {
    if (!state) state = Object.assign({}, INITIAL_ENTITY_STATE);
    switch (action.type) {
        case FETCH_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
                error     : null
            });
        }
        case FETCH_SUCCESS: {
            return Object.assign({}, state, {
                isFetching : false,
                lastUpdated: action.lastUpdated,
                data       : action.append
                                ? !state.data
                                    ? __toArray(action.data)
                                    : state.data.concat(__toArray(action.data))
                                : action.data,
                error: null
            });
        }
        case FETCH_FAILURE: {
            return Object.assign({}, state, {
                isFetching : false,
                lastUpdated: action.lastUpdated,
                data       : null,
                error      : action.error
            });
        }
        case RESET_ENTITY: {
            return Object.assign({}, INITIAL_ENTITY_STATE, {
                lastUpdated: action.lastUpdated
            });
        }
    }
}
```
## <a name="redux-entity#additional-actions">Additional Actions</a> 
The following action creators are synchonrous. Use them to reset or delete your entity:

| Action creator | Description                                                           |
|---------------:|:----------------------------------------------------------------------|
| `resetEntity`  | Set the `data` property on the entity to `null`. Update `lastUpdated` |
| `deleteEntity` | Delete the entity from `state.model`                                  |

### Example usage
   1. `connect()` your component to Redux.
   2. Map the action creators (`resetEntity`, `deleteEntity`) in `mapDispatchToProps`.
   3. Pass your `entity` name, and the current time to either action creator.
```javascript
import React from 'react';
import { connect } from 'react-redux';
import { resetEntity, deleteEntity } from 'redux-entity';

function Entity({
    entityName,
    entity,
    resetEntity,
    deleteEntity
}) {

    if (!entity) return <span />;
    const { error, data, isFetching } = entity;

    if (isFetching) {
        return <span>Loading!</span>;
    } else if (error) {
        return <span>{ error.message }</span>
    }

    return (
        <div>
            <ul>
                { data.map((value, index) =>
                    <li key={index}> {value.label}</li>
                )}
            </ul>
            <button onClick={() => resetEntity(entityName, Date.now())}>Reset</button>
            <button onClick={() => deleteEntity(entityName, Date.now())}>Delete</button>
        </div>
    )
}

Entity.propTypes  = {
    entityName: React.PropTypes.string.isRequired,
    entity: React.PropTypes.shape({
        isFetching: React.PropTypes.bool,
        lastUpdated: React.PropTypes.number,
        data: React.PropTypes.object,
        error: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ])
    }),
    resetEntity: React.PropTypes.func.isRequired,
    deleteEntity: React.PropTypes.func.isRequired
};

export default connect (null, {
    resetEntity,
    deleteEntity
})(Entity);
```

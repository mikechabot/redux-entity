[![Build Status](https://travis-ci.org/mikechabot/redux-entity.svg?branch=master)](https://travis-ci.org/mikechabot/redux-entity)
[![Dependency Status](https://david-dm.org/mikechabot/redux-entity.svg)](https://david-dm.org/mikechabot/redux-entity)
[![Dev Dependency Status](https://david-dm.org/mikechabot/redux-entity/dev-status.svg)](https://david-dm.org/mikechabot/redux-entity?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/redux-entity/badge.svg?branch=master)](https://coveralls.io/github/mikechabot/redux-entity?branch=master)

# redux-entity

`redux-entity` seeks to provide a predictable approach to maintaining domain entities in Redux. It's comprised of a **[thunk](https://github.com/gaearon/redux-thunk#whats-a-thunk)** and a **[reducer](http://redux.js.org/docs/basics/Reducers.html)**.

- [Live Demo](#live-demo)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Additional Actions](#additional-actions)

## Live Demo
http://mikechabot.github.io/react-boilerplate/

## <a name="redux-entity#getting-started">Getting Started</a>
###1. Installation
Using `npm` or `yarn`:
- ```$ yarn add redux-entity```
- ```$ npm -i -S redux-entity```

###2. Configure the root reducer
In your root reducer, import the `model` reducer from `redux-entity`, and use it with [`combineReducers()`](http://redux.js.org/docs/api/combineReducers.html):
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
Ensure `redux-thunk` middelware is applied, along with your root reducer:

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
###4. Create and inject the Redux store
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import configureStore from './redux/store/configure-store';

ReactDOM.render(
    <Root store={configureStore()} />,
    document.getElementById('example-app')
);
```
###5. Create a custom thunk
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

Optionally pass a configuration to your thunk (see [Configuration](#configuration)): 
```javascript`
export function loadOrders() {
    return loadEntity(
        'orders',
        OrderService.getOrders(),
        { silent: true, append: true }
    );
}
```

Dynamically pass a configuration: 
```javascript`
export function loadOrders(options) {
    return loadEntity(
        'orders',
        OrderService.getOrders(),
        options
    );
}
```

###6. Create a React component
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
## <a name="redux-entity#configuration">Configuration</a>
A configuration object can be passed to [`loadEntity`](#reducer) as the third argument, and the following properties are available for use: 
```javascript
{
    // If true, do NOT dispatch the FETCH_REQUEST action, which sets the "isFetching" 
    // property on the entity to true. Do this to inhibit any UI hooks on "isFetching".
    silent: true,  // default: false (i.e. always dispatch FETCH_REQUEST)

    // If true, do NOT overwrite the data property whenever FETCH_SUCCESS is dispatched,
    // but rather append any new data to whatever already exists on the entity.
    append: true   // default: false (i.e. always overwrite)
}
```

### When configuring `append` to `true`, consider the following examples:

1. When the data promise retuns an `object`, it will be pushed onto an array. Merging does NOT occur:
    ```javascript
    function fetchFoo () {
        return loadEntity(
            'foobar',
            Promise.resolve({ randomNum: Math.random() }),
            { append: true }
        );
    }

    fetchFoo()(dispatch);  // Call once
    fetchFoo()(dispatch);  // Call twice
    ```
    **Resulting State (two objects in a single array)**
    ```json
    {
       "foobar":{
          "isFetching":false,
          "lastUpdated":1480807317751,
          "data":[
             {
                "randomNum":0.99437688223453
             },
             {
                "randomNum":0.02760231206535746
             }
          ],
          "error":null
       }
    }
    ```
2. When the data promise retuns an `array`, it will be concatenated with any existing data:
    ```javascript
    function fetchFoo () {
        return loadEntity(
            'foobar',
            Promise.resolve([Math.random(), Math.random()]),
            { append: true }
        );
    }

    fetchFoo()(dispatch);  // Call once
    fetchFoo()(dispatch);  // Call twice
    ```
    **Resulting State (four entries in a single array)**
    ```json
    {
       "foobar":{
          "isFetching":false,
          "lastUpdated":1480807969474,
          "data":[
             0.3740764599842803,
             0.46176137669506945,
             0.9866826383932925,
             0.7325032000955436
          ],
          "error":null
       }
    }
    ```

## <a name="redux-entity#additional-actions">Additional Actions</a> 
The following action creators are synchonrous, and can be used to reset or delete your entity. Check out the [Live Demo](#live-demo) to see these in action.

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

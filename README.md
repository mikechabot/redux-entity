# redux-entity

[![npm version](https://badge.fury.io/js/redux-entity.svg)](https://badge.fury.io/js/redux-entity)
[![Build Status](https://travis-ci.org/mikechabot/redux-entity.svg?branch=master)](https://travis-ci.org/mikechabot/redux-entity)
[![Dependency Status](https://david-dm.org/mikechabot/redux-entity.svg)](https://david-dm.org/mikechabot/redux-entity)
[![Dev Dependency Status](https://david-dm.org/mikechabot/redux-entity/dev-status.svg)](https://david-dm.org/mikechabot/redux-entity?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/mikechabot/redux-entity/badge.svg?branch=master)](https://coveralls.io/github/mikechabot/redux-entity?branch=master)

`redux-entity` seeks to provide a predictable approach to maintaining domain entities in Redux.

- [Live Demo](#live-demo)
- [Usage](#usage)
  - [loadEntity](#load-entity)
  - [Custom Thunk Example](#custom-thunk-example)
  - [Entity Properties](#entity-properties)
  - [Redux State](#redux-state)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Configuration Options](#configuration-options)
- [Additional Actions](#additional-actions)

## <a name="redux-entity#installation">Live Demo</a>
[Click here](http://mikechabot.github.io/react-boilerplate/dist/) to see `redux-entity` as utilized in [react-boilerplate](https://github.com/mikechabot/react-boilerplate). 

## <a name="redux-entity#usage">Usage</a> 

Each custom thunk you create with `loadEntity` is associated with a specific set of properties to ensure predictability.

### <a name="redux-entity#load-entity">loadEntity</a>

Accepts an entity name, a promise, and an options object.

| Argument | Description | Type | Required | 
| -------- | ----------- | ---- | ---------|
| `name` | Entity name | string | Yes |
| `promise` | Data promise | [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | Yes |
| `options` | See [configuration options](#configuration-options) | object | No |


### <a name="redux-entity#custom-thunk-example">Custom Thunk Example</a>

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

### <a name="redux-entity#entity-properties">Entity Properties</a>

| Property | Description |
| -------- | ----------- |
| `data` | The results of a resolved promise |
| `error` | The results of the rejected promise |
| `isFetching` | Whether the entity's promise is pending |
| `lastUpdated` | Timestamp of the entity's last update |

### <a name="redux-entity#redux-state">Redux State</a>

If `loadOrders` succeeds, the results are stamped on `orders.data` and `lastUpdated` is updated:

```
{
  "model": {
    "orders": {
      "isFetching": false,
      "data": [
      	{ orderId: 1, type: 'FOO' },
      	{ orderId: 2, type: 'BAR' } 
      	{ orderId: 3, type: 'BAZ' } 
      ],
      "lastUpdated": 1494092038176,
      "error": null,
    }
  }
}
```

If `loadOrders` fails, the results are stamped on `order.error` and `lastUpdated` is updated:

```
{
  "model": {
    "orders": {
      "isFetching": false,
      "error": {
        "message": "Error fetching data!"
      },
      "lastUpdated": 1494094113880,
      "data": null
    }
  }
}
```

## <a name="redux-entity#installation">Installation</a>
Yarn: or npm:
- ```$ yarn add redux-entity```
- ```$ npm i -S redux-entity```

## <a name="redux-entity#getting-started">Getting Started</a>

### 1. Configure the root reducer
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
### 2. Configure the Redux store
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
### 3. Create and inject the Redux store
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
### 4. Create a custom thunk
Import `loadEntity()` from `redux-entity` along with **your domain service**, and define an entity key (e.g. `orders`) that will be associated with the given promise.
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

Optionally pass a configuration to your thunk (see [Configuration](#configuration-options)): 
```javascript
export function loadOrders() {
    return loadEntity(
        'orders',
        OrderService.getOrders(),
        { silent: true, append: true }
    );
}
```

Dynamically pass a configuration: 
```javascript
export function loadOrders(options) {
    return loadEntity(
        'orders',
        OrderService.getOrders(),
        options
    );
}
```

### 5. Create a React component
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
## <a name="redux-entity#configuration-options">Configuration Options</a>
An `options` object can be passed to [`loadEntity`](#reducer) as the third argument, and the following properties are available for configuration: 

### `silent` (default: `false`, type: `Boolean`)
* If true, do not dispatch the `FETCH_REQUEST` action, which sets the `isFetching` property on the entity to true. 
* Set `silent` to `true` to inhibit any UI hooks that are listenting for `isFetching` to be `true`, for instance, to show a loading indicator. 

### `append` (default: `false`, type: `Boolean`)
* By default, each time you invoke your custom thunk (e.g. `loadOrders()`), it will overwrite the entity's `data` property with fresh data. 
* If `append` is set to `true`, new data will be appended to the entity's existing data.

### `processors` (default: `null`, type: `Object`)
* `processors` grant you access to various stages in the `loadEntity` lifecycle. 
* All processors have access to Redux dispatch (be careful!) along with either the data object, if the promise resolves, or the error object if the promise rejects.
* Use of `processors` is optional, but should be considered for advanced use-cases.

#### Available processors
| Processor        | Description                    | When to use                                     | Type       |
|-----------------:|:-------------------------------|-------------------------------------------------|------------|
| `beforeSuccess`  | Invoked before `FETCH_SUCCESS` | Process the data before its dispatched to Redux | `Function` |
| `afterSuccess`   | Invoked after `FETCH_SUCCESS`  | Take action after the entity's state changes    | `Function` |
| `beforeFailure`  | Invoked before `FETCH_FAILURE` | Process the error before its dispatched to Redux| `Function` |
| `afterFailure`   | Invoked after `FETCH_FAILURE`  | Take action after the error is dispatched       | `Function` |

**Note**: [See here](https://github.com/mikechabot/redux-entity/blob/master/src/thunk.js#L49) for how `processors` are implemented in `loadEntity`.

#### Example Configuration
```javascript
{
    silent: true,
    append: true,
    processors: {
        beforeSuccess: function (dispatch, data) {
            dispatch({ type: 'SOME_ACTION' });
            return _.map(data, 'stuff');
        },
        afterFailure : function (dispatch, error) {
            dispatch({ type: 'SOME_ERROR', error })
        }
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
        isFetching : React.PropTypes.bool,
        lastUpdated: React.PropTypes.number,
        data       : React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number,
            React.PropTypes.object,
            React.PropTypes.array
        ]),
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

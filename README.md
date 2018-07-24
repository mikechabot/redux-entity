# redux-entity

<div align="center">
A predictable approach to maintaining domain entities in Redux.
<br /><br />
  <a href="https://www.npmjs.com/package/redux-entity">
    <img src="https://img.shields.io/npm/v/redux-entity.svg?style=flat-square" alt="npm version" />
  </a>
  <a href="https://travis-ci.org/mikechabot/redux-entity">
    <img src="https://travis-ci.org/mikechabot/redux-entity.svg?branch=master" alt="build status" />
  </a>
  <a href="https://coveralls.io/github/mikechabot/maybe-baby?branch=master">
    <img src="https://coveralls.io/repos/github/mikechabot/maybe-baby/badge.svg?branch=master&cacheBuster=1" alt="coverage status" />
  </a>
  <a href="https://david-dm.org/mikechabot/redux-entity">
    <img src="https://david-dm.org/mikechabot/redux-entity.svg" alt="dependency status" />
  </a>
  <a href="https://david-dm.org/mikechabot/redux-entity?type=dev">
    <img src="https://david-dm.org/mikechabot/redux-entity/dev-status.svg" alt="devDependency status" />
  </a>
</div>

<hr />

- [Demo](#demo)
- [Install](#install)
- [Getting Started](#getting-started)
- [loadEntity(name, promise, options)](#loadentitykey-promise-options)
- [Redux State](#redux-state)
- [Detailed Usage](#detailed-usage)
- [Configuration Options](#configuration-options)
- [Additional Actions](#additional-actions)

## <a name="redux-entity#demo">Demo</a>
[Click here to see a live demo](http://mikechabot.github.io/react-boilerplate/dist/) 

## <a name="redux-entity#install">Install</a>

* `$ npm install redux-entity`

## <a name="redux-entity#getting-started">Getting Started</a> 

At its core, `redux-entity` is just a [reducer](https://redux.js.org/basics/reducers); it's designed to deal with asynchronous actions, but it can handle synchronous calls just as easily.

Most web applications need to handle a variety of domain entities, be it Orders, Customers, Products, Users, etc. This library was designed to manage these objects in a predictable and scalable way.

The API is very simplistic; a single thunk called [`loadEntity`](#loadentitykey-promise-options) is exposed, which does all the heavy lifting. 

> Every entity you fetch is automatically associated with the following properties to ensure predictability. No need to track these yourself.

| Property | Description |
| -------- | ----------- |
| `data` | The entity's data (i.e. Products, Orders, etc) |
| `error` | Error if the entity fetch failed |
| `isFetching` | Whether the entity is currently fetching |
| `lastUpdated` | Date/time of the entity's last success or failure |

## <a name="redux-entity#loadentitykey-promise-options">`loadEntity(key, promise, options)`</a>

When using `loadEntity`, you only need to provide two elements: a key to uniquely identify the entity, and a promise to fetch the data. 

> Don't worry if you can't provide a promise, `redux-entity` will automatically promisify synchronous calls.

Here's a simple example of loading orders:

```javascript
import { loadEntity } from 'redux-entity';
import OrderService from './services/order-service';

const key = 'orders';
const promise = OrderService.getOrders();

export function loadOrders() {
    return loadEntity(key, promise);
}
```

Continue on to see what happens when `loadOrders` is invoked.

## <a name="redux-entity#redux-state">Redux State</a>

In the context of React, let's say we have an `<Orders />` component; when the component mounts, we'll want to fetch our data:

```javascript
componentDidMount() {
    this.props.loadOrders();
}
```

While `loadOrders` is pending, `isFetching` is set to true:

```
{
  "entities": {
    "orders": {
      "isFetching": true,
      "lastUpdated": null,
      "data": null,
      "error:" null
    }
  }
}
```

If `loadOrders` **succeeds**, the results are stamped on `entities.orders.data`, and `lastUpdated` is also updated:

```
{
  "entities": {
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

If `loadOrders` **fails**, the results are stamped on `entities.orders.error`, and `lastUpdated` is also updated:

```
{
  "entities": {
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

If we need to load more entities, we just create additional thunks with [`loadEntity`](#loadentitykey-promise-options):

```
{
  "entities": {
    "orders": {
      ...
    },
    "products": {
      ...
    },
    "customers": {
      ...
    }
  }
}
```

## <a name="redux-entity#detailed-usage">Detailed Usage</a>

### 1. Configure the root reducer
In your root reducer, import the `entities` reducer from `redux-entity`, and use it with [`combineReducers()`](http://redux.js.org/docs/api/combineReducers.html):
```javascript
// root-reducer.js
import { combineReducers } from 'redux';
import { entities } from 'redux-entity';

export default combineReducers({
    ...<your other reducers>,
    entities
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
    state => ({orders: state.entities && state.entities.orders}),
    { loadOrders }
)(Orders);
```
## <a name="redux-entity#configuration-options">Configuration Options</a>
Optionally pass a configuration to a custom thunk with any of the following properties:

| Argument | Type | Default | Description | 
| -------- | ----------- | ---- | ---------|
| `silent` | boolean | `false` | If `true`, don't toggle `isFetching` when the thunk is invoked |
| `append` | boolean | `false` | If `true`, attach the results of each invocation to the existing `data` property instead of overwriting |
| `processors` | object | `null` | Hook into the `loadEntity` lifecycle. Each processor has access to Redux `dispatch` along with either the `data` or `error` object of the entity. See [processors](#processors)|


#### <a name="redux-entity#processors">Processors</a>
Processors are completely optional and in most cases won't be needed, since `redux-entity` automatically tracks `lastUpdated`, `isFetching`, and either `data` or `error` out-of-the-box. But you can take additional action when an entity's promise either resolves or rejects by hooking into the processors below.

| Processor        | When to use  | Signature |
| ---------------- | ------------ | ---- |
| `beforeSuccess`  | Take action after the promise resolves, but before the entity's `data` is dispatched to Redux | `func(dispatch, data)` |
| `afterSuccess`   | Take action after the promise resolves, and after an entity's `data` has been updated |  `func(dispatch, data)` |
| `beforeFailure`  | Take action after the promise rejects, but before the entity's `error` is dispatched to Redux |  `func(dispatch, error)` |
| `afterFailure`   | Take action after the promise rejects, and after an entity's `error` has been updated | `func(dispatch, error)` |

#### Example Configurations

Simple
```javascript
loadEntity('orders', OrderService.getOrders(), { append: true })
```

Advanced (with processors)
```javascript
const options = {
    silent: true,
    append: true,
    processors: {
        beforeSuccess: function (dispatch, data) {
            // do stuff
        },
        afterFailure : function (dispatch, error) {
            // do stuff
        }
    }
}

loadEntity('orders', OrderService.getOrders(), options)
```

## <a name="redux-entity#additional-actions">Additional Actions</a> 
The following action creators are synchonrous, and can be used to reset or delete your entity. Check out the [Live Demo](#live-demo) to see these in action.

| Action creator | Description                                                           |
|---------------:|:----------------------------------------------------------------------|
| `resetEntity`  | Set the `data` property on the entity to `null`. Update `lastUpdated` |
| `deleteEntity` | Delete the entity from `state.entities`                                  |

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

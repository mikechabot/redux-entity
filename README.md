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
- [Integrate into Redux](#integrate-into-redux)
- [loadEntity(name, promise, options)](#loadentitykey-promise-options)
- [Redux State](#redux-state)
- [Detailed Usage](#detailed-usage)
- [Configuration Options](#configuration-options)
- [Additional Actions](#additional-actions)

## <a name="redux-entity#demo">Demo</a>
[Click here to see a live demo](http://mikechabot.github.io/react-boilerplate/dist/) 

> Check out the demo repository at https://github.com/mikechabot/react-boilerplate

## <a name="redux-entity#install">Install</a>

* `$ npm install redux-entity`

## <a name="redux-entity#getting-started">Getting Started</a> 

At its core, `redux-entity` is just a [reducer](https://redux.js.org/basics/reducers); it's designed to deal with asynchronous actions in the form of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Moreover, most web applications need to handle a variety of domain entities, be it Orders, Customers, Products, Users, etc. This library was designed to manage these objects in a predictable and scalable way.

The API is very simplistic; once [integrated into Redux](#integrate-into-redux), a single thunk called [`loadEntity`](#loadentitykey-promise-options) is exposed, which does all the heavy lifting. 

> Every entity you fetch is automatically associated with the following properties to ensure predictability. No need to track these yourself.

| Property | Description |
| -------- | ----------- |
| `data` | The entity's data (i.e. Products, Orders, etc) |
| `error` | Error if the entity fetch failed |
| `isFetching` | Whether the entity is currently fetching |
| `lastUpdated` | Date/time of the entity's last success or failure |

## <a name="redux-entity#integrate-into-redux">Integrate into Redux</a> 

To get started, simply import `entities` from `redux-thunk`, and combine with your existing reducers.

> By default, we're carving out a space in the Redux tree with the key of `entities`, but you can rename it to whatever you'd like.

```javascript
// root-reducer.js
import { entities } from 'redux-entity';
import { combineReducers } from 'redux';

export default combineReducers({
    ...<existing reducers>,
    entities
});
```

Now we're ready to use [`loadEntity`](#loadentitykey-promise-options).

## <a name="redux-entity#loadentitykey-promise-options">`loadEntity(key, promise, options)`</a>

When using `loadEntity`, you only need to provide two elements: a key to uniquely identify the entity, and a promise to fetch the data.

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

> See [Detailed Usage](#detailed-usage) for the full React component.

```javascript
componentDidMount() {
    this.props.loadOrders();
}
```

While `loadOrders` is pending, `isFetching` is set to true:

```javascript
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

If `loadOrders` **succeeds**, the results are stamped on `entities.orders.data`, and `lastUpdated` is set:

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

If `loadOrders` **fails**, the results are stamped on `entities.orders.error`, and `lastUpdated` is set:

```javascript
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

If we need to load more entities, we just create additional thunks with [`loadEntity`](#loadentitykey-promise-options), and invoke them as described above.

> Every entity we fetch will be stamped on the `entities` tree.

```javascript
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

This guide assumes you've already injected the Redux store into your React application.

### 1. Configure the root reducer

Follow along with [Integrate into Redux](#integrate-into-redux) to integrate `entities` into your existing Redux store. 

### 2. Create a custom thunk

Create a thunk using `loadEntity`. You only need to provide a key that uniquely identifies the entity, and a data promise.

> You can optionally pass a configuration to `loadEntity`. See [Configuration](#configuration-options): 

```javascript
import { loadEntity } from 'redux-entity';
import OrderService from './services/order-service';

const key = 'orders';
const promise = OrderService.getOrders();

export function loadOrders() {
    return loadEntity(key, promise);
}
```

### 3. Create a React component

Here's a full React component that utilizes our `loadOrders` example, which implements `loadEntities`. At this point, `loadOrders` is no different from any other Redux thunks.

> The following code is considered boilerplate for integrating Redux thunks.

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
    
        const { orders } = this.state;

        if (!orders) {
            return <span />;
        }
        
        const { error, data, isFetching } = orders;

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

const mapStateToProps = state => ({orders: state.entities && state.entities.orders});
const mapDispatchToProps = { loadOrders };

export default connect(
    mapStateToProps,
    mapDispatchToProps
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

Simple configuration:
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

export function loadOrders() {
    return loadEntity(
        'orders',
        OrderService.getOrders(),
        options
    );
}
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

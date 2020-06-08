<img src='https://raw.githubusercontent.com/mikechabot/image-assets/master/redux-entity-logo.png' alt='logo' aria-label='https://github.com/mikechabot/redux-entity' />

At its core, `redux-entity` is just a [reducer](https://redux.js.org/basics/reducers) that utilizes a specialized [thunk](https://github.com/reduxjs/redux-thunk#whats-a-thunk), which is designed to handle asynchronous actions in the form of a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Most web applications need to handle a variety of domain entities such as orders, products, users, etc. This library was designed to manage these objects within Redux in a predictable and scalable way.

<div align="center">
<br />
  <a href="https://www.npmjs.com/package/redux-entity">
    <img src="https://img.shields.io/npm/v/redux-entity.svg?style=flat-square" alt="npm version" />
  </a>
  <a href="https://travis-ci.org/mikechabot/redux-entity">
    <img src="https://travis-ci.org/mikechabot/redux-entity.svg?branch=master" alt="build status" />
  </a>
  <a href="https://coveralls.io/github/mikechabot/redux-entity?branch=master">
    <img src="https://coveralls.io/repos/github/mikechabot/redux-entity/badge.svg?branch=master&cacheBuster=1" alt="coverage status" />
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
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Integrate into Redux](#integrate-into-redux)
  - [GetEntity(key, promise, options)](#GetEntity-promise-options)
  - [Redux Store](#redux-store)
- [Detailed Usage](#detailed-usage)
- [Configuration Options](#configuration-options)
- [Additional Thunks](#additional-thunks)

## <a name="redux-entity#demo">Demo</a>

[Click here to see a live demo](http://mikechabot.github.io/react-boilerplate/dist/)

> Check out the demo repository at https://github.com/mikechabot/react-boilerplate

## <a name="redux-entity#install">Install</a>

`$ npm install redux-entity`

`$ yarn add redux-entity`

## <a name="redux-entity#getting-started">Getting Started</a>

The API is very simplistic; a thunk called [`GetEntity`](#GetEntity-promise-options) is exposed, which does all the heavy lifting.

> Every entity you fetch is automatically associated with the following properties to ensure predictability. No need to track these yourself.

```typescript
interface EntityState {
  /** Data returned from the resolved promise */
  data?: any;
  
  /** Error returned from the rejected promise */
  error?: Error;
  
  /** Whether the entity promise is pending */
  isFetching: boolean;
  
  /** Timestamp of the promise's last resolution or rejection */
  lastUpdated?: Date | undefined;
}
```

### <a name="redux-entity#integrate-into-redux">Integrate into Redux</a>

To get started, import `reducers` from `redux-entity`, and combine with your existing reducers.

> By default, we're carving out a space in the Redux tree with the key of `entities`, but you can rename it to whatever you'd like.

```javascript
// root-reducer.ts
import { reducer as entities } from 'redux-entity';
import { combineReducers } from 'redux';

export default combineReducers({
    ...<existing reducers>,
    entities
});
```

Now we're ready to use [`GetEntity`](#GetEntity-promise-options).

### <a name="redux-entity#GetEntity-promise-options">`GetEntity(key, promise, options)`</a>

When using `GetEntity`, you only need to provide two elements: a key to uniquely identify the entity, and a promise to fetch the data.

```javascript
import { GetEntity } from 'redux-entity';
import OrderService from './services/order-service';

const key = 'orders';
const promise = OrderService.getOrders();

export const loadOrders = () => GetEntity(key, promise);
```

### <a name="redux-entity#redux-store">Redux Store</a>

Let's take a look at what the Redux store looks like when `loadOrders` is invoked.

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

If `loadOrders` **succeeds**, the results are stamped on the store at `entities.orders.data`, and `lastUpdated` is set:

```
{
  "entities": {
    "orders": {
      "isFetching": false,
      "data": [
      	{ orderId: 1, name: 'Coke' },
      	{ orderId: 2, name: 'Pepsi' },
      	{ orderId: 3, name: 'Dr. Pepper' }
      ],
      "lastUpdated": 1494092038176,
      "error": null,
    }
  }
}
```

If `loadOrders` **fails**, the results are stamped on the store at `entities.orders.error`, and `lastUpdated` is set:

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

If we need to load more entities, we just create additional thunks with [`GetEntity`](#GetEntity-promise-options), and invoke them as described above.

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

---

## <a name="redux-entity#detailed-usage">Detailed Usage</a>

The guide below assumes you've already injected the Redux store into your React application.

### 1. Configure the root reducer

Follow along with [Integrate into Redux](#integrate-into-redux) to integrate the reducer into your existing Redux store.

### 2. Create a custom thunk

Create a thunk using `GetEntity`. You only need to provide a key that uniquely identifies the entity, and a data promise.

> You can optionally pass a configuration to `GetEntity`. See [Configuration](#configuration-options):

```javascript
import { GetEntity } from 'redux-entity';
import OrderService from './services/order-service';

const key = 'orders';
const promise = OrderService.getOrders();

export const loadOrders = () => GeEntity(key, promise);
```

### 3. Create a React component

Here's a full React component that utilizes our `loadOrders` example. At this point, `loadOrders` is no different than any other Redux thunk.

```javascript
// Orders.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadOrders } from '../redux/thunks';
import { connect } from 'react-redux';

class Orders extends Component {
  componentDidMount() {
    this.props.loadOrders();
  }

  render() {
    const { orders } = this.props;

    if (!orders) {
      return null;
    }

    const { error, data, isFetching } = orders;

    if (isFetching) {
      return <span>Loading!</span>;
    } else if (error) {
      return <span>{error.message}</span>;
    }

    return (
      <ul>
        {data.map(({orderId, name}) => <li key={orderId}> {name}</li>)}
      </ul>
    );
  }
}

Orders.propTypes = {
  orders: PropTypes.object,
  loadOrders: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ orders: state.entities && state.entities.orders });
const mapDispatchToProps = { loadOrders };

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
```

---

## <a name="redux-entity#configuration-options">Configuration Options</a>

Optionally pass a configuration with any of the following properties:

| Argument     | Type    | Default | Description                                                                                                                                                                                    |
| ------------ | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `silent`     | boolean | `false` | If `true`, don't toggle `isFetching` when the thunk is invoked                                                                                                                                 |
| `append`     | boolean | `false` | If `true`, append the results of each invocation to the existing `data` property instead of overwriting it                                                                                     |
| `processors` | object  | `null`  | Hook into the `GetEntity` lifecycle. Each processor has access to Redux's `dispatch` and `getState` along with either the `data` or `error` object of the entity. See [Processors](#processors) |

The options configuration must adhere to the following interface:

```typescript
interface ReduxEntityOptions {
  [OptionKey.Silent]?: boolean;
  [OptionKey.Append]?: boolean;
  [OptionKey.Processors]?: Processors;
}

enum OptionKey {
  Silent = 'silent',
  Append = 'append',
  Processors = 'processors',
}
```

#### Example Configurations

Simple configuration:

```javascript
const key = 'orders';
const promise = OrderService.getOrders();
const options = { silent: true, append: true };

export const loadOrders = () => GetEntity(key, promise, options)
```

Dynamically pass a configuration:

```javascript
const key = 'orders';
const promise = OrderService.getOrders();

export const loadOrders = (options) => GetEntity(key, promise, options);
```

---

#### <a name="redux-entity#processors">Processors</a>

Processors are  optional and in most cases won't be needed, however you can take additional action when an entity's promise either resolves or rejects by hooking into the processors below.

| Processor       | When is this executed?                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `beforeSuccess` | After promise resolution, but _before_ `data` is dispatched to the store. **Must** return `any`        |
| `afterSuccess`  | After promise resolution, and _after_ the store has been updated                                       |
| `beforeFailure` | After promise rejection, but _before_ the `error` is dispatched to the store. **Must** return `error`  |
| `afterFailure`  | After promise rejection, and _after_ the store has been updated                                        |

The processor object must adhere to the following interface:

```typescript
type Processors = {
  [key in ProcessorType]?: (
    data: any,
    dispatch: ThunkDispatch<ReduxEntityState, unknown, AnyAction>,
    getState: GetState
  ) => any | void;
};

enum ProcessorType {
  BeforeSuccess = 'beforeSuccess',
  AfterSuccess = 'afterSuccess',
  BeforeFailure = 'beforeFailure',
  AfterFailure = 'afterFailure',
}
```

Configuration with processors:

```javascript
const key = 'orders';
const promise = OrderService.getOrders();

const options = {
  silent: true,
  processors: {
    beforeSuccess: (data, dispatch, getState) => {
      // Do synchronous stuff
      // *Must* return data to be dispatched to the store
      return Object.keys(data);
    },
    beforeFailure: (error, dispatch, getState) => {
      // Do synchronous stuff
      // *Must* return an error to the dispatched to the store
      return new Error('Intercepted error!');
    },
  },
};

export const loadOrders = () => GetEntity(key, promise, options);
```

---

## <a name="redux-entity#additional-thunks">Additional Thunks</a>

The following actions can be use to reset or delete your entity.

> Check out the [Demo](#demo) to see these in action.

| Action creator | Description                                    |
| -------------: | :----------------------------------------------|
|  `ResetEntity` | Reset the entity to the original `EntityState`, and set `lastUpdated` |
| `DeleteEntity` | Delete the entity from `state`                 | 

### Example usage

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ResetEntity, DeleteEntity } from 'redux-entity';

const Orders = ({ entityKey, orders, resetEntity, deleteEntity }) => {
  if (!orders) {
    return <span />;
  }

  const { error, data, isFetching } = orders;

  if (isFetching) {
    return <span>Loading!</span>;
  } else if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <div>
      <ul>
        {data.map((value, index) => (
          <li key={index}> {value.label}</li>
        ))}
      </ul>
      <button onClick={() => resetEntity(entityKey)}>Reset</button>
      <button onClick={() => deleteEntity(entityKey)}>Delete</button>
    </div>
  );
}

Entity.propTypes = {
  entityKey: PropTypes.string.isRequired,
  orders: PropTypes.object,
  resetEntity: PropTypes.func.isRequired,
  deleteEntity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ orders: state.entities && state.entities.orders });
const mapDispatchToProps = {
  resetEntity: ResetEntity
  deleteEntity: DeleteEntity
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
```

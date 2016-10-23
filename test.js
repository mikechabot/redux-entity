'use strict';

const reduxEntity = require('./index');

function dispatch(action) {
    console.log(action);
}

reduxEntity.loadEntity('foo', Promise.resolve({data: 'foo'}))(dispatch);
reduxEntity.loadEntity('bar', Promise.reject({data: 'bar'}))(dispatch);
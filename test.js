'use strict';

const reduxEntity = require('./index');

const resolve = Promise.resolve({foo: 'bar'});
const reject = Promise.reject({foo: 'bar'});

function dispatch(action) {
    console.log(action);
}

console.log(reduxEntity.loadEntity('fooEntity', resolve)(dispatch));
console.log(reduxEntity.loadEntity('fooEntity', reject)(dispatch));
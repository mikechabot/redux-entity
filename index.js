'use strict';

const reducer = require('./src/reducer')
const loadEntity = require('./src/load-entity-thunk');

module.exports = {
    reducer: reducer,
    loadEntity: loadEntity
};
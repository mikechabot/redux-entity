'use strict';

const reducer = require('./src/reducer');
const loadEntity = require('./src/load-entity-thunk');
const { resetEntity, deleteEntity } = require('./src/action-creators');

module.exports = {
    reducer: reducer,
    loadEntity: loadEntity,
    resetEntity: resetEntity,
    deleteEntity: deleteEntity
};
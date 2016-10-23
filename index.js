'use strict';

const model = require('./src/reducer');
const loadEntity = require('./src/thunk');
const { resetEntity, deleteEntity } = require('./src/common/action-creators');

module.exports = {
    model: model,
    loadEntity: loadEntity,
    resetEntity: resetEntity,
    deleteEntity: deleteEntity
};
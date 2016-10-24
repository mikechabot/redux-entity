'use strict';

const model = require('./src/reducer');
const loadEntity = require('./src/thunk');
const actionCreators = require('./src/common/action-creators');

module.exports = {
    model: model,
    loadEntity: loadEntity,
    resetEntity: actionCreators.resetEntity,
    deleteEntity: actionCreators.deleteEntity
};
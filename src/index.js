'use strict';

const model = require('./reducer');
const loadEntity = require('./thunk');
const actionCreators = require('./action-creators');

module.exports = {
    model       : model,
    loadEntity  : loadEntity,
    resetEntity : actionCreators.resetEntity,
    deleteEntity: actionCreators.deleteEntity
};

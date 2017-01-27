'use strict';

var model = require('./reducer');
var loadEntity = require('./thunk');
var actionCreators = require('./action-creators');

module.exports = {
    model: model,
    loadEntity: loadEntity,
    resetEntity: actionCreators.resetEntity,
    deleteEntity: actionCreators.deleteEntity
};
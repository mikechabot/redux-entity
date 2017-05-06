'use strict';

var reducer = require('./reducer');
var thunk = require('./thunk');
var actionCreators = require('./action-creators');

module.exports = {
    entities: reducer,
    loadEntity: thunk,
    resetEntity: actionCreators.resetEntity,
    deleteEntity: actionCreators.deleteEntity
};
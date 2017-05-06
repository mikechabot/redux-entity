'use strict';

const reducer = require('./reducer');
const thunk = require('./thunk');
const actionCreators = require('./action-creators');

module.exports = {
    entities    : reducer,
    loadEntity  : thunk,
    resetEntity : actionCreators.resetEntity,
    deleteEntity: actionCreators.deleteEntity
};

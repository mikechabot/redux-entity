'use strict';

const reducer = require('./redux/reducer');
const loadEntity = require('./redux/thunk-action-creators');

module.exports = {
    reducer: reducer,
    loadEntity: loadEntity
};
'use strict';

const { DEFAULT_OPTIONS } = require('./entity-const');

function EntityConfiguration (options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
}

EntityConfiguration.prototype.getProcessors = function () {
    return this.options.processors;
};

EntityConfiguration.prototype.isSilent = function () {
    return this.options.silent;
};

EntityConfiguration.prototype.doAppend = function () {
    return this.options.append;
};

module.exports = EntityConfiguration;

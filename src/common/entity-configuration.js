'use strict';

function EntityConfiguration (options) {
    this.processors = {};
    this.silent = false;
    this.append = false;

    if (options) {
        this.__init(options);
    }
}

EntityConfiguration.prototype.__init = function (options) {
    if (options.processors) this.processors = options.processors;
    if (options.silent) this.silent = options.silent;
    if (options.append) this.append = options.append;
};

EntityConfiguration.prototype.getProcessors = function () {
    return this.processors;
};

EntityConfiguration.prototype.isSilent = function () {
    return this.silent;
};

EntityConfiguration.prototype.doAppend = function () {
    return this.append;
};

module.exports = EntityConfiguration;

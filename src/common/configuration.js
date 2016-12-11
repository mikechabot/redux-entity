const CONST = require('./const');

function Configuration (options) {
    this.options = Object.assign({}, CONST.DEFAULT_OPTIONS, options);
}

Configuration.prototype.getProcessors = function () {
    return this.options.processors;
};

Configuration.prototype.isSilent = function () {
    return this.options.silent;
};

Configuration.prototype.doAppend = function () {
    return this.options.append;
};

module.exports = Configuration;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function EntityConfiguration(options) {
  this.processors = {};
  this.silent = false;
  this.append = false;

  if (options) {
    this.init(options);
  }
}

EntityConfiguration.prototype.init = function (options) {
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

var _default = EntityConfiguration;
exports.default = _default;
/**
 * @license MIT
 * Copyright (c) 2016 Craig Monro (kodespace.com)
 **/

 "use strict";
var _ = require('./not_');

var _options = {verbose:0, debug:false};


// NB: a nice color map was found here: https://coderwall.com/p/yphywg/printing-colorful-text-in-terminal-when-run-node-js-script

var _colors = {
	Reset: "\x1b[0m"
	, Bright: "\x1b[1m"
	, Dim: "\x1b[2m"
	, Underscore: "\x1b[4m"
	, Blink: "\x1b[5m"
	, Reverse: "\x1b[7m"
	, Hidden: "\x1b[8m"

	, FgBlack: "\x1b[30m"
	, FgRed: "\x1b[31m"
	, FgGreen: "\x1b[32m"
	, FgYellow: "\x1b[33m"
	, FgBlue: "\x1b[34m"
	, FgMagenta: "\x1b[35m"
	, FgCyan: "\x1b[36m"
	, FgWhite: "\x1b[37m"

	, BgBlack: "\x1b[40m"
	, BgRed: "\x1b[41m"
	, BgGreen: "\x1b[42m"
	, BgYellow: "\x1b[43m"
	, BgBlue: "\x1b[44m"
	, BgMagenta: "\x1b[45m"
	, BgCyan: "\x1b[46m"
	, BgWhite: "\x1b[47m"
};


function log() {
	this.module_name = '';
}

log.prototype.constructor = log;
log.prototype.init = function(options) { 
	_options.verbose = options.verbose || 0;
	if (options.quiet)
		_options.verbose = -1;
	if (options.debug)
		_options.debug = options.debug;
}
log.prototype.module = function(str) { 
	var t = new log();
	if (str && str.length>0)
		t.module_name = str + ': '; // for some reason, a sub module was required, but no name was desired.
	return t;
}
log.prototype._verbosity = function() { return _.isDefined(this.verbose) ? this.verbose : _options.verbose; }
log.prototype.logf  = function (str) { console.log(this.module_name + str); }
log.prototype.log   = function (str) { if (this._verbosity()>=0) this.logf(str); }
log.prototype.logw  = function (str) { console.log(_colors.FgYellow+'**WARNING. '+this.module_name+str+_colors.Reset); }
log.prototype.loge  = function (str) { console.error(_colors.FgRed+'**ERROR. '+ this.module_name+str+_colors.Reset); }
log.prototype.logd  = function (str) { if (_options.debug || this.debug) console.log('\x1b[2m'+this.module_name+str+_colors.Reset); }
log.prototype.vlog  = function (str) { if (this._verbosity()>0) this.log(str); }
log.prototype.vvlog = function (str) { if (this._verbosity()>1) this.log(str); }
log.prototype.vlogw = function (str) { if (this._verbosity()>0) this.logw(str); }
log.prototype.vvlogw= function (str) { if (this._verbosity()>1) this.logw(str); }
log.prototype.vlogd = function (str) { if (_options.debug>1 || this.debug>1) this.logd(str); }
log.prototype.vvlogd= function (str) { if (_options.debug>2 || this.debug>2) this.logd(str); }
log.prototype.dump  = _.dump
log.prototype._colors = _colors;
log.prototype._options = _options;

module.exports = new log();
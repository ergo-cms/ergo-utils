/**
 * @license MIT
 * Copyright (c) 2016 Craig Monro (kodespace.com)
 **/

/*
* A note about module naming. Always use abc-def-ghi to represent ghi submodule of def submodule of abc module
*/
var _ = require('./not_');

//function ll(str) { console.log(_colors.FgGreen + _colors.Dim + str +_colors.Reset)}
var _global_log = new Log();


var registered_modules = { };

var _optionsTree = { // a tree of possible options. The user/developer can configre other options here
	 	'default': {verbose:0, debug:-1}
	};
var _optionsCache = { };// this is a cache of results, for better performance

function __initOptions(o) {
	o = o || {};
	o.verbose = 0;
	o.debug = -1;
	return o;
}

function __applyOptions(o1, o2) {
	if (_.isDefined(o2.verbose))
		o1.verbose = o2.verbose;
	if (_.isDefined(o2.debug))
		o1.debug = o2.debug;
	if (o2.quiet || o1.quiet) {
		o1.verbose = -1;
		o1.debug = -1;
		o1.quiet = true;
	}
	return o1;
}

function __resetOptions(o1, o2) {
	o1 = __initOptions(o1);
	__applyOptions(o1,o2);
	return o1;
}
function _splitModuleName(module) {
	if (!module || module=='default') return ['default'];

	// given 'abc-def-ghi', return a list:
	// [ 'abc', 'abc-def', 'abc-def-ghi' ]
	var modules = module.split('-');
	return modules.map(function(m, idx) { 
		return modules.slice(0,idx+1).join('-'); 
	});
}
function _calcOptions(module) {
	var o = __applyOptions({},_optionsTree['default']);
	if (o.quiet)
	{
		
	}
	// start from root & then apply down thru each module
	_splitModuleName(module).forEach(function(module) {
		if (_optionsTree[module])
			__applyOptions(o, _optionsTree[module]);
	})
	//ll(module + "=>" + _.dump(o))
	return o;
}

function _getOptions(module) {
	if (!_optionsCache[module])
		// look for it in the cache, else build it
		_optionsCache[module] = _calcOptions(module);
	return _optionsCache[module];
}



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


function Log() {
	this._module = '';
	this._pre = ''; // the string to apply before each call to log().
	this._ifFilterFn = null;
	this._ifFilterParams = undefined;
}

Log.prototype.constructor = Log;
Log.prototype.init = function(options) { 
	_optionsCache = { }; // reset the cache

	// make sure the root option is set
	__resetOptions(_optionsTree['default'], options);
	
	if (options.log_options) { // we've been given a list of module specific log options
	//ll("setting =============\n " + _.dump(options.log_options)+ "\n=============")
		var keys= Object.keys(options.log_options);
		for (var i=0; i<keys.length; i++) {
			var key = keys[i];
			_optionsTree[key] = __applyOptions({}, options.log_options[key])
		}
	}
	//ll("_optionsTree =============\n " + _.dump(_optionsTree) + "\n=============")
}

Log.prototype.module = function(str) { 
	if (str && str.length>0 && registered_modules[str])
		return registered_modules[str];

	var l = new Log();
	if (str && str.length>0) {
		l._module = str;
		l._pre = str + ': ';
		registered_modules[str] = l;
	}
	return l;
}


Log.prototype.global = _global_log; // give every module a chance to get back to the original log
Log.prototype._verbosity = function() { return _.isDefined(this.verbose) ? this.verbose : _getOptions(this._module).verbose; }
Log.prototype._debuglevel = function() { return _.isDefined(this.debug) ? this.debug : _getOptions(this._module).debug; }
Log.prototype.__dolog  = function (str, level, color, stream) { 
	var clr = this.color || color || '';
	//if (clr) 
	{
		if (level>1) // verbose
			clr += _colors.Dim; 
		//else if (level<1 && this._verbosity()>1)
		//	clr += _colors.Bright;
	}
	stream = stream || console.log
	stream.call(console, (clr||'')+ str + (clr ? _colors.Reset : '')); 
}

Log.prototype._dolog  = function (str, level, color) { 
	this.__dolog(this._pre + str, level, color);
}
Log.prototype.log = function(str, level) 
{ 
	level = level||0; 
	if (this._verbosity()>=level) 
		this._dolog(str, level); 
}

Log.prototype.logw  = function (str, level) { 
	this.__dolog('**WARNING. '+ this._pre + str, level, _colors.FgYellow); 
}
Log.prototype.loge  = function (str) { 
	this.__dolog('**ERROR. '  + this._pre + str, 0, _colors.FgRed);//, console.error); 
}

Log.prototype.logd  = function (str, level) { 
	level = level || 0;
	if (this._debuglevel()>=level) 
		this._dolog(str, level, _colors.FgCyan); 
}

Log.prototype.vlog  = function (str) { this.log("> "+ str, 1); }
Log.prototype.vvlog = function (str) { this.log(">> "+ str, 2); }
Log.prototype.vlogw = function (str) { this.logw("> "+ str, 1); }
Log.prototype.vvlogw= function (str) { this.logw(">> "+str, 2); }
Log.prototype.vlogd = function (str) { this.logd("> "+str, 1); }
Log.prototype.vvlogd= function (str) { this.logd(">> "+str, 2); }

// Conditional logging


Log.prototype.setIfConditioner = function(fnCallback, params) { // fnCallback(Obj) & returns true or false
	this._ifFilterFn = fnCallback;
	this._ifFilterParams = params;
};


Log.prototype.If = function(data) {
	var filterResult = false;
	if (this._ifFilterFn)
		filterResult = this._ifFilterFn(data, this._ifFilterParams);
	else if (_global_log._ifFilterFn)
		filterResult = _global_log._ifFilterFn(data, _global_log._ifFilterParams);
	return filterResult;
};

Log.prototype.logIf = function(data, level, str) { // It's really LogOrIf...kinda
	if (this.If(data))
		this.log(_colors.FgYellow + "#" + '>>'.substr(0,level) + (this.color?this.color:_colors.Reset) + str, Math.max(0, level-1));
	//else
	//	this.log(str, level);

};

Log.prototype.logdIf = function(data, level, str) {  // It's really LogOrIf...kinda
	// simiar to above, BUT writes to logd if fails
	if (this.If(data))
		this.log(_colors.FgYellow + "#" + '>>'.substr(0,level) + (this.color?this.color:_colors.Reset) + str, Math.max(0, level-1));
	//else
	//	this.logd(str, level)
};

Log.prototype.dump  = _.dump
Log.prototype._colors = _colors;
Log.prototype.noColors = function() {
	for (var k in _colors) 
		_colors[k] = '';
	// ...attempts at coloring are now ineffective
}

module.exports = _global_log; // this becomes a singleton, b/c node loading always returns the same object for multiple require()



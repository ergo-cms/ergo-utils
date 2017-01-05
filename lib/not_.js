/**
 * @license MIT
 * Copyright (c) 2016 Craig Monro (kodespace.com)
 **/

var deepExtend = require('deep-extend');

var n_ = { // similar to lodash & notunderscore, but without the awful file structure/dependency tree. hence, *very* minimalistic, but with hidden gems!

  isString: function (x) { return typeof x == 'string'; }
, isEmptyString: function(x) { return !x || x.length==0; }
, isUndefined: function (x) { return (typeof x == 'undefined'); }
, isDefined: function (x) { return !n_.isUndefined(x); }
, isBool: function (x) { return typeof x == 'boolean'; }
, isObject: function (x) { return x !== null && typeof x === 'object'}
, isFunction: function (x) { return typeof x == 'function'; }
, isArray: Array.isArray || function(obj) { 
		return toString.call(obj) === '[object Array]'; 
	}
, isEmptyObject( obj ) {
	    for ( var name in obj ) {
	        return false;
	    }
	    return true;
	}


, toRealArray: function (arrayIsh, stringSplitChars) {
		if (n_.isArray(arrayIsh)) 
			return arrayIsh;
		if (n_.isString(arrayIsh))
			return arrayIsh.split(stringSplitChars || ',');
		var ar = [];
		for (var i=0; i<arrayIsh.length; i++)
			ar.push(arrayIsh[i]);
		return ar;
	}
, shallowExtend: function (origin) { // copied from electron-api-demos/node_modules/glob/glob.js & then hacked to oblivion
		// now, you can keep extending, by using
		// _.extend(origin, data1, data2, data3) & all options will be added onto origin only.
		// The 'rightmost' value of a key will be applied.

		for (var a=1; a<arguments.length; a++) {
			var add = arguments[a];
			if (add === null || typeof add !== 'object')
				continue;

			var keys = Object.keys(add)
			var i = keys.length
			while (i--) {
				origin[keys[i]] = add[keys[i]]
			}
		}

		return origin
	}
, deepExtend: deepExtend // it has the same parameters as _extend, so, fits right in as-is
, extend: deepExtend

, min: function (x,y) { return x<y ? x : y; } // without requiring Math.min / Math.max
, max: function (x,y) { return x>=y ? x : y; }
, dumpOptions: { colors:true, maxArrayLength:20, breakLength:15 }
, dump: function(obj, options) {
		return require('util').inspect(obj, n_.extend({}, n_.dumpOptions, options||{}))
	}	

, niceStackTrace: function(e) {
		if (e.stack)
			// just get the first few lines which contains the file,linnume & same of where the problem is
			return e.stack.split('\n').splice(0, 4).join('\n');
		else
			return e.toString();
	}

};

module.exports = n_;

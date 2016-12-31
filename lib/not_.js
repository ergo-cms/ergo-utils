/**
 * @license MIT
 * Copyright (c) 2016 Craig Monro (kodespace.com)
 **/

var n_ = { // similar to lodash & notunderscore, but without the awful file structure/dependency tree. hence, *very* minimalistic, but with hidden gems!

  isString: function (x) { return typeof x == 'string'; }
, isUndefined: function (x) { return (typeof x == 'undefined'); }
, isDefined: function (x) { return !n_.isUndefined(x); }
, isBool: function (x) { return typeof x == 'boolean'; }
, isString: function (x) { return typeof x == 'string'; }
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


, toRealArray: function (arrayIsh) {
		if (n_.isArray(arrayIsh)) 
			return arrayIsh;
		var ar = [];
		for (var i=0; i<arrayIsh.length; i++)
			ar.push(arrayIsh[i]);
		return ar;
	}
, extend: function (origin, add) { // copied from electron-api-demos/node_modules/glob/glob.js
		if (add === null || typeof add !== 'object') {
			return origin
		}

		var keys = Object.keys(add)
		var i = keys.length
		while (i--) {
			origin[keys[i]] = add[keys[i]]
		}
		return origin
	}

, min: function (x,y) { return x<y ? x : y; } // without requiring Math.min / Math.max
, max: function (x,y) { return x>=y ? x : y; }
, dump: function(obj, depth) { 
	var cache = [];
	depth = depth || 2;
	return JSON.stringify(obj, function(key, value) {
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return;
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    if (key == 'parent')
		    	return '[parent]'; // this will (nearly) always generate unwanted recursion
		    return value;
		}
	, depth); }	
};

module.exports = n_;

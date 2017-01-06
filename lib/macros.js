

// USAGE:
// 		require('ergo-utils').inject_macros()

// console.error(__TODO__)

// Why so cumbersome? Because we're injecting code into the GLOBAL scope, which frankly said, is never great thing.
// Note that the policy usage is that this should ONLY be used for debugging.

module.exports = function() { // TODO add ability to define a macro: eg require(...)(['__BUG__', '__LINE__(__FILE__): Bug detected here'])

	// based on: http://stackoverflow.com/a/11386493/125525

	Object.defineProperty(global, '__stack__', {
	  get: function(){
	    var orig = Error.prepareStackTrace;
	    Error.prepareStackTrace = function(_, stack){ return stack; };
	    var err = new Error;
	    Error.captureStackTrace(err, arguments.callee);
	    var stack = err.stack;
	    Error.prepareStackTrace = orig;
	    return stack;
	  }
	});
	const stack_offset = 1;
	function __fnLine(offset) {
		var s = __stack__;
		offset = offset || stack_offset;
		if (offset>=s.length)
			offset = s.length-1;
		return s[offset].getLineNumber();
	}
	function __fnFilename(offset) {
		var s = __stack__;
		offset = offset || stack_offset;
		if (offset>=s.length)
			offset = s.length-1;
		return s[offset].getFileName().split('/').slice(-1)[0];
	}

	Object.defineProperty(global, '__line__', {
	  get: function(){
	    return __fnLine();
	  }
	});
	Object.defineProperty(global, '__file__', {
	  get: function(){
	    return __fnFilename();
	  }
	});


	Object.defineProperty(global, '__TODO__', {
	  get: function(){
	    return "TODO at " + __fnFilename(stack_offset+1) + "("+__fnLine(stack_offset+1)+")";
	  }
	});

	// log using the global logger (not specific to this module)
	require('./log').vlogw('ENABLED macros in ' + __fnFilename(stack_offset+1) + "("+__fnLine(stack_offset+1)+ "). Their use should be disabled in Production systems");
}

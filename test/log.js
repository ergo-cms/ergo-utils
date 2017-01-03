var log = require('../lib/log');


describe('Checks changing global log values', function() {
	var defaultOptions = {verbose:0,debug:false};

	it('Verbosity is zero', function(){
		assert.equal(log._verbosity(), 0);
	});
	it('Changes options', function() {
		log.init({verbose:-100});
		assert.equal(log._verbosity(),-100);
	});
	it('Checks default options changed', function() {
		assert.notDeepEqual(log._options, defaultOptions);
	});
	it('Resets default options', function() {
		log.init(defaultOptions); // reset
		assert.equal(log._verbosity(),0);
	});
});

describe('test log (global)', function(){
	var str = "The quick brown fox jumped\t over the lazy dog. 十二月"

	it('log', function(){
		var stdout = require("test-console").stdout;
		var output = stdout.inspectSync(function() {
    		log.log(str);
		});
		assert.deepEqual(output, [ str + '\n' ] );
 	});
	it('loge', function(){
		var stderr = require("test-console").stderr;
		var output = stderr.inspectSync(function() {
    		log.loge(str);
		});
		assert.deepEqual(output, [ log._colors.FgRed+'**ERROR. '+str+log._colors.Reset + '\n' ] );
 	});

 	
});


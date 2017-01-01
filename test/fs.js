
var fs = require('../lib/fs');
var _ = require('../lib/not_');
var path = require('path');


describe('Checks fs Sync', function() {
	it('has node-js functions', function() {
		assert.isTrue(_.isFunction(fs['readdir']), 'fs.readdir exists');
		assert.isTrue(_.isFunction(fs['readFile']), 'fs.readFile exists');
		assert.isTrue(_.isFunction(fs['writeFileSync']), 'fs.writeFileSync exists');
	});
	it('dirExistsSync', function() {
		assert.isTrue(fs.dirExistsSync(__dirname), 'A directory')
		assert.isNotTrue(fs.dirExistsSync(__filename), 'A file')
		assert.isNotTrue(fs.dirExistsSync(path.join(__dirname, 'idontexist_probably')), 'A directory that doesn\'t exist')
	})
	it('fileExistsSync', function() {
		assert.isTrue(fs.fileExistsSync(__filename), 'A file')
		assert.isNotTrue(fs.fileExistsSync(__dirname), 'A directory')
		assert.isNotTrue(fs.fileExistsSync(path.join(__dirname, 'idontexist_probably')), 'A file that doesn\'t exist')
	})
	it('parentFindFileSync', function() {
		assert.equal(fs.parentFindFileSync(__dirname, 'package.json'), path.join(path.dirname(__dirname), 'package.json'), 'package.json')
		assert.isNull(fs.parentFindFileSync(__dirname, 'idontexist_probably'), 'A file that doesn\'t exist')
	})
	it('findFileSync', function() {
		assert.equal(fs.findFileSync(__dirname, 'chai.js'), path.join(__dirname, 'helpers', 'chai.js'), 'helpers/chai.js')
		assert.isNull(fs.findFileSync(__dirname, 'idontexist_probably'), 'A file that doesn\'t exist')
	})
});


function check( done, err, f ) {
  try {
  	if (err) { done(err); return;}
    f();
    done();
  } catch( e ) {
    done( e );
  }
}

describe('Checks fs Async', function() {
	it('dirExists on a folder', function(done) {
		fs.dirExists(__dirname, function(err, result) {
			check(done, err, function() { assert.isTrue(result); });
		});
	});
	it('dirExists on a file', function(done) {
		fs.dirExists(__filename, function(err, result) {
			check(done, err, function() { assert.isNotTrue(result); });
		});
	});
	it('dirExists on a missing folder', function(done) {
		fs.dirExists(path.join(__dirname,'iprobably_dont_exist'), function(err, result) {
			check(done, err, function() { assert.isNotTrue(result); });
		});
	});

	it('fileExists on a folder', function(done) {
		fs.fileExists(__dirname, function(err, result) {
			check(done, err, function() { assert.isNotTrue(result); });
		});
	});
	it('fileExists on a file', function(done) {
		fs.fileExists(__filename, function(err, result) {
			check(done, err, function() { assert.isTrue(result); });
		});
	});
	it('fileExists on a missing folder', function(done) {
		fs.fileExists(path.join(__dirname,'iprobably_dont_exist'), function(err, result) {
			check(done, err, function() { assert.isNotTrue(result); });
		});
	});
	it('parentFindFile on a file', function(done) {
		fs.parentFindFile(__dirname, 'package.json', function(err, result) {
			check(done, err, function() { assert.equal(result, path.join(path.dirname(__dirname), 'package.json')); });
		});
	});
	it('parentFindFile on a missing file', function(done) {
		fs.parentFindFile(__dirname,'iprobably_dont_exist', function(err, result) {
			check(done, err, function() { assert.isNull(result); });
		});
	});
	it('findFile on a file', function(done) {
		fs.findFile(__dirname, 'chai.js', function(err, result) {
			check(done, err, function() { assert.equal(result, path.join(__dirname, 'helpers', 'chai.js')); });
		});
	});
	it('findFile on a missing file', function(done) {
		fs.findFile(__dirname,'iprobably_dont_exist', function(err, result) {
			check(done, err, function() { assert.isNull(result); });
		});
	});


});


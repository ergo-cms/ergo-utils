/**
 * @license MIT
 * Copyright (c) 2016 Craig Monro (kodespace.com)
 *
 * Filesystem extension helpers (beyond even that of fs-extra)
 *
 * NOTE: we do NOT promisify anything here, but keep it node-js style.
 * NOTE: the helper function which assumes an external 'Promise' library is available
 **/


var fs = require('fs');
var path = require('path');
var _ = require('./not_');

var _fs = {

	  isInDir: function(dir, file) { // is IN dir?
			var d = path.dirname(file);
			if (d.length<dir.length) return false; // can't be inside.
			d = d.substr(0, dir.length);
			return d.toLowerCase()==dir.toLowerCase();
		}

	, fixupPathSep: function(str) { // make sure the path is pointing the right way for the platform (windows/'nix)
			if (str)
				return str.replace(/\\/g,path.sep).replace(/\//g,path.sep);
			else 
				return str;
		}

	, dirExistsSync: function(filename) {  // node.js has deprecated its fs.exists :(
			try { 
				return fs.lstatSync(filename).isDirectory(); 
			} catch(e) { return false; } 
		} 
	, dirExists: function(filename, callback) {
			fs.lstat(filename, function(err, stats) {
				if (err) return callback(null, false); // eat errors. this function expects 'em
				return callback(null, stats.isDirectory())
			})
		}
	, fileExistsSync: function(filename) {  // node.js has deprecated its fs.exists :(
			try { 
				return fs.lstatSync(filename).isFile(); 
			} catch(e) { return false; } 
		} 
	, fileExists: function(filename, callback) {
			fs.lstat(filename, function(err, stats) {
				if (err) return callback(null, false); // eat errors. this function expects 'em
				return callback(null, stats.isFile())
			})
		}
	, parentFindFileSync: function(dir, filename) {
		var name = path.join(dir, filename);
		if (fs.existsSync(name))
			return name;

		var parent = path.dirname(dir);
		if (parent.length>1 && fs.existsSync(parent))
			return _fs.parentFindFileSync(parent, filename); 
		return null;
	}
	, parentFindFile: function(dir, filename, callback) {
		var name = path.join(dir, filename);
		fs.exists(name, function(exists){
			if (exists)
				return callback(null, name)

			var parent = path.dirname(dir);
			if (parent.length>1) {
 				fs.exists(parent, function(exists) {
 					if (exists)
	 					return _fs.parentFindFile(parent, filename, callback); 
					// can't search higher: this is the last one, we failed to find it
	 				return callback(null, null);
 				})
			}
			else
				// can't search higher: this is the last one, we failed to find it
				return callback(null, null)

		})
	}
	, findFileSync: function(dir, filename) {
		var name = path.join(dir, filename);
		if (fs.existsSync(name))
			return name;

		var files = fs.readdirSync(dir);
		for (var i=0; i<files.length; i++) {
			name = path.join(dir, files[i]);
			if (fs.lstatSync(name).isDirectory()) {
				var retVal = _fs.findFileSync(name, filename);
				if (retVal) 
					return retVal;
			}
		}
		return null;
	}
	, findFile: function(dir, filename, callback) {
		var name = path.join(dir, filename);
		fs.exists(name, function(exists){
			if (exists)
				return callback(null, name)

			fs.readdir(dir, function(err, files) {

				// build a list of subdirs
				var subdirs = [];
				files.forEach(function(file) {
					var name = path.join(dir, file);
					var stats = fs.lstatSync(name); // Sync here is NOT nice, but get's terribly yucky otherwise. It'd be easier with generators & the like, but we're staunchly node-js ish here.
					if (stats && stats.isDirectory()) {
						subdirs.push(name); // save it for next iteration
					}
				});

				if (subdirs.length==0) {
					// no subdirs.
					return callback(null, null);
				}

				var waiting = subdirs.slice(); // take a copy of the dirs

				// Now we have a list of subdirs & a list of dirs who hasn't finished searching yet

				// iterate all the sub dirs
				subdirs.forEach(function(name) {
					_fs.findFile(name, filename, function(err, found) { // search for the file in subdirs
						if (!waiting)
							return; // don't care. someone else positively found the file!!!
						var index = waiting.indexOf(name);

						// a dir should ALWAYS be able to find itself in the waiting list.
						// If this assertion triggers, it means that node-js has become re-entrant, which it shouldn't have.
						// (callbacks occur sequentially, but not concurrently, as they are phase locked with node-js' single threaded message pump).
						assert(index >- 1, "unexpected timing issue detected in findFile"); 


						if (index > -1) // redundant check with the above assert()
						    waiting.splice(index, 1); // we're no longer waiting for this dir to finish

						if (!err && found) {
							waiting = null; // don't wait for anything else. (This aborts any chance of calling the 'failed' callback, below)
							return callback(null, found); // found it, bubble up
						}
						// eat up any errors. Errors mean we didn't find it anyway.

						// else ... definitely didn't find it in *this* subdir

						if (index > -1 && waiting.length==0) {
							//we were the last one. didn't find anything :(
							return callback(null, null); // bubble up the failed result
						}
					});
				}); // subdirs.forEach

			}); // fs.readdir

		}) // fs.exists
	}

	, extend: function(base_fs) {
		base_fs = base_fs || fs; // if not specified... use node-js fs.
		return _.extend({}, _fs, base_fs); // apply node-js-fs (fs-extra) last, ie On Top.
	}
 };
 

 module.exports = _fs;


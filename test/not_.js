
var _ = require('../lib/not_');


describe('Checks not underscore (not_)', function() {
	it('isString', function() {
		assert.isTrue(_.isString("This is a string"))
		assert.isNotTrue(_.isString(1))
		assert.isNotTrue(_.isString({ }))
	});
	it('isUndefined and isDefined', function() {
		assert.isTrue(_.isDefined("This is a string"))
		assert.isNotTrue(_.isUndefined("This is a string"))
		var obj = { }
		assert.isNotTrue(_.isDefined(obj['not here']))
		assert.isTrue(_.isUndefined(obj['not here']))
	});
	it('isBool', function() {
		assert.isTrue(_.isBool(!!1))
		assert.isNotTrue(_.isBool("A String"));
		assert.isNotTrue(_.isBool({ }));
	})
	it('isObject', function() {
		assert.isTrue(_.isObject({ }), "An empty object");
		assert.isNotTrue(_.isObject("A String"), "A string");
		assert.isNotTrue(_.isObject(1), "A number")
		assert.isNotTrue(_.isObject( _.isObject ), "A function")
		assert.isTrue(_.isObject( new Array() ), "An array")
		assert.isNotTrue(_.isObject( ), "An undefined value");
	})
	it('isFunction', function() {
		assert.isTrue(_.isFunction( _.isObject ), "A function");
		assert.isNotTrue(_.isFunction( _ ), "An object");
		assert.isNotTrue(_.isFunction( ), "An undefined value");
	})
	it('isArray', function() {
		assert.isTrue(_.isArray( [] ) , "An array");
		assert.isNotTrue(_.isArray( {} ), "An empty object");
		assert.isTrue(_.isArray( new Array() ), "An Array object");
	})
	it('isEmptyObject', function() {
		assert.isTrue(_.isEmptyObject( [] ) , "An array");
		assert.isTrue(_.isEmptyObject( {} ) , "An empty object");
		assert.isNotTrue(_.isEmptyObject( _ ), "An object");
		assert.isTrue(_.isEmptyObject( new Array() ), "An empty Array object");
	})
	it('extend', function() {
		var o = _.extend(
			{level:1}, {level:2,addedin2:true,alsoAddedIn2:true}, {level:3,addedin2:undefined,addedin3:"Level 3"})
		assert.equal(o.level, 3 , "Level should be overridden");
		assert.equal(o.addedin2, undefined, "addedin2 should be deleted");
		assert.equal(o.alsoAddedIn2, true, "alsoAddedIn2 should be present");
		assert.equal(o.addedin3, "Level 3", "addedin3 should be a string");
	})
	it('toRealArray', function() {
		var str = "The quick brown fox jumped\t over the lazy dog. 十二月"
		var arrayObj = new Array();
		assert.equal(arrayObj, _.toRealArray(arrayObj), "An Array object");
		var arrayObj2 = [];
		assert.equal(arrayObj2, _.toRealArray(arrayObj2), "An array");
		const buf1 = Buffer.from(str, 'utf8');
		assert.notEqual(buf1, _.toRealArray( buf1 ) , "A NodeBuffer");
		assert.equal(buf1.toString('utf8'), 
			decodeURIComponent(escape(String.fromCharCode.apply(String,_.toRealArray( buf1 )))) , "A NodeBuffer as a utf8 string");
	})
});

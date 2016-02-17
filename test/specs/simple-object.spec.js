describe('Simple object', function() {
    var foo;

    beforeEach(function() {
        foo = new Foo('John');
    });

    it('should say hi', function() {
        expect(foo.sayHi()).toEqual('John says hi!');
    });
});

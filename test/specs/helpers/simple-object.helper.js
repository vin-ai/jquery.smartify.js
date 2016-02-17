function Foo(name) {
  this.name = name;
}

Foo.prototype.sayHi = function() {
  return this.name + ' says hi!';
};

var foo = new Foo('Vinay');
foo.sayHi(); // Vinay says hi!

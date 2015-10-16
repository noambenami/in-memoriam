'use strict';

require('chai').should();
var Cache = require('./');

describe('Cache', function () {
  var cache = new Cache(5, 100);

  it('can store & retrieve objects', function () {

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    cache.get('a').should.be.equal(1);
    cache.get('b').should.be.equal(2);
    cache.get('c').should.be.equal(3);
  });

  it('expire objects', function (done) {
    cache.stats.size().should.be.equal(3);

    setTimeout(function () {
      // Cache entries should have expired
      cache.stats.size().should.be.equal(0);
      done();
    }, 105);
  });

  it('replaces elements when an existing key is set', function () {
    cache.set('a', 1);
    cache.stats.size().should.be.equal(1);
    cache.get('a').should.be.equal(1);

    cache.set('a', 2);
    cache.stats.size().should.be.equal(1);
    cache.get('a').should.be.equal(2);
  });

  it('evicts oldest element when capacity is exceeded', function () {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('d', 4);
    cache.set('f', 5);
    cache.set('g', 6);
    cache.set('h', 7);

    cache.get('h').should.be.equal(7);

    var bIsNull = cache.get('b') === null;
    bIsNull.should.be.equal(true);
  });

  it('evicts objects when no ttl is preset', function () {
    var cache = new Cache(2);
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a').should.be.equal(1);
    cache.get('b').should.be.equal(2);

    cache.set('c', 3);
    var aIsNull = cache.get('a') === null;
    aIsNull.should.be.equal(true);

    cache.get('b').should.be.equal(2);
    cache.get('c').should.be.equal(3);
  });
});

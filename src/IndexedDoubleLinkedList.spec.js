'use strict';

require('chai').should();
var IDLL = require('./IndexedDoubleLinkedList');

describe('IndexedDoubleLinkedList', function () {
  var list = new IDLL();

  list.add('a', 1);
  list.add('b', 2);
  list.add('c', 3);

  it('has circular links in both directions', function () {
    // Navigation newest to oldest
    var entry = list.get('c');
    entry.value.should.be.equal(3);

    entry = entry.next;
    entry.value.should.be.equal(2);

    entry = entry.next;
    entry.value.should.be.equal(1);

    entry = entry.next;
    entry.value.should.be.equal(3);

    // Navigate backwards
    entry = entry.previous;
    entry.value.should.be.equal(1);

    // Navigate backwards
    entry = entry.previous;
    entry.value.should.be.equal(2);

    // Navigate backwards
    entry = entry.previous;
    entry.value.should.be.equal(3);
  });

  it('can find oldest element', function () {
    list.getOldest().value.should.be.equal(1);
  });

  it('can remove elements from the list', function () {
    // Remove the middle element and make sure links are updated
    // correctly
    list.length().should.be.equal(3);

    var entry = list.remove('b');
    entry.value.should.be.equal(2);
    list.length().should.be.equal(2);

    entry = list.get('a');
    entry.next.should.be.equal(entry.previous);

    entry.next.value.should.be.equal(3);

    // Remove elements until list is empty, then make sure
    // we can still add elements
    list.remove('a');
    list.remove('c');

    list.length().should.be.equal(0);

    list.add('a', 1);

    list.length().should.be.equal(1);
  });
});

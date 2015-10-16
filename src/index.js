'use strict';

/**
 * A very simple cache with a very simple reaper thread that runs
 * once a second.
 *
 * @constructor
 * @param {Number} Capacity Maximum number of items in the cache. When
 *                 exceeded, oldest item is evicted to make room.
 * @param {Number} [ttl] Number of milliseconds items can live in the cache,
 *                 renewed on every get. If not specified, objects stay in the
 *                 cache until removed due to cache capacity being exceeded.
 *                 For immutable data, leaving ttl empty is recommended.
 */

var IDLL = require('./IndexedDoubleLinkedList');

module.exports = function (capacity, ttl) {

  var self = this;

  // Store the entries in a doubly-linked circular loop. This makes it trivial
  // to find the oldest item in O(1) time by looking at newestEntry.previous.
  // It also makes it trivial to take an entry and make it the newest one if
  // it is created or refreshed via a get.
  var cache = new IDLL();

  self.stats = {
    hits:         0,
    misses:       0,
    inserts:      0,
    updates:      0,
    evictions:    0,
    expirations:  0,
    size:         cache.length
  };

  /**
   * Adds an item to the cache. Will overwrite any existing value and evict
   * an old item if the cache is full.
   *
   * @param {String} key
   * @param {*} value
   */
  self.set = function (key, value) {
    var entry = cache.get(key);
    if (entry) {
      // Existing item, just update the value. The get
      // operation will have updated the entry's ttl.
      entry.value = value;
      self.stats.updates++;
      return;
    }
    // New item, make room for it if needed
    if (self.stats.size() === capacity) {
      var oldest = cache.getOldest();
      cache.remove(oldest.key);
      self.stats.evictions++;
    }

    entry = cache.add(key, value);
    self.stats.inserts++;

    // Schedule the potential removal of this key
    if (ttl) {
      entry.expires = (new Date()).getTime() + ttl;
      setTimeout(evictOrReschedule, ttl, key);
    }
  };

  /**
   * Gets the key and if found, updates its expiration time
   */
  self.get = function (key) {
    var entry = cache.remove(key);
    if (entry) {
      self.stats.hits++;
      // Put it back in, which will make it the newest item
      cache.add(key, entry.value);
      return entry.value;
    }
    self.stats.misses++;
    return null;
  };

  // Private methods

  /**
   * Deletes the key if it expired, or sets a new watch on it
   * if it has not.
   */
  function evictOrReschedule(key) {
    // The entry may already have been evicted due to cache hitting capacity
    var entry = cache.get(key);
    if (!entry) {
      return;
    }

    var now = new Date();
    // ms left till object expires
    var timeLeft = entry.expires - now.getTime();
    if (timeLeft > 0) {
      // Renew the scheduled removal
      setTimeout(evictOrReschedule, timeLeft, key);
      return;
    }

    // Item has expired
    cache.remove(key);
    self.expirations++;
  }
};

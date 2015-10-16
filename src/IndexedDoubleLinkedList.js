'use strict';

/**
 * Doubly linked list whose entries are accessible via keys. Built to
 * enable constant time removal of "oldest" entries, reordering of
 * updated entries and addition of new ones. This enables our cache
 * to grow large with minimal interruption to the system as it is
 * updated/queried.
 *
 * @constructor
 */
module.exports = function () {
  var self = this;

  var entries = {};     // Hash of linked entries
  var newest  = null;   // Latest added entry
  var size    = 0;      // Number of entries in the hash

  /**
   * Returns count of elements in the list
   */
  self.length = function () {
    return size;
  };

  /**
   * Adds a new entry in front of the current newestEntry
   *
   * @returns {{next: null, previous: *, key: *, value: *, expires: *}}
   */
  self.add = function (key, value) {
    if (entries[key]) {
      throw new Error('Key "' + key + '" is already preset.');
    }

    // Create the entry
    var entry = {
      key:      key,
      value:    value
    };

    // This entry is now the newest, so rewire all the references
    // in the double linked circular list
    if (newest) {
      entry.next      = newest;
      entry.previous  = newest.previous || newest;

      newest.previous     = entry;
      if (entry.previous) {
        entry.previous.next = entry;
      }
    }

    // Place it in the indexed collection
    entries[key] = entry;
    newest = entry;
    size++;

    return entry;
  };

  /**
   * Gets the value associated with the given key
   *
   * @param {*} key
   * @returns {*}
   */
  self.get = function (key) {
    return entries[key];
  };

  /**
   * Gets the "last" element in the list
   */
  self.getOldest = function () {
    return newest && newest.previous;
  };

  /**
   * Removes an entry from this list
   *
   * @return The removed element or null if not found/empty
   */
  self.remove = function (key) {
    var entry = entries[key];
    if (!entry) {
      return null;
    }

    if (size === 1) {
      newest = null;
    } else if (size >= 2) {
      var next = entry.next;
      if (size === 2) {
        next.next = next.previous = null;
      } else {
        next.previous = entry.previous;
        entry.previous.next = next;
      }

      if (newest === entry) {
        newest = entry.next;
      }
    }

    // Update the indexed collection
    delete entries[key];
    size--;

    return entry;
  };
};

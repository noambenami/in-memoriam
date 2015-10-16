# johnny-cache
Easy to use, high-speed O(1) to O(n) for all operations, in-memory key-value cache with both ttl and capacity support.
This caching system has been used in multiple production systems for a while now and has proven
stable, quietly improving performance for a host of scenarios, such as:
- Caching security tokens
- Caching frequently read/infrequently updated database objects
- Caching lookup data fetched from remote REST services

This module exports the cache constructor, making usage as simple as:
    var Cache = require('johnny-cache');
    // Create a 
    var capacity = 1000; // Least recently accessed/oldest items are removed when capacity is exceeded
    var ttl = 10000; // TTL is in milliseconds. Items not accessed by end of TTL are evicted.
    var cache = new Cache(capacity, ttl);
    cache.set('names', [ 'joe', 'jim', 'jill', 'jane' ]);
    var names = cache.get('names');
    
The number of cache instances that can be created is limited only by memory. Note that caches will execute
a callback every ttl ms to execute eviction logic, so very high capacity caches with a high degree of churn
may have CPU impact. Use caches wisely, and tune them using real world data.

Caches maintain metrics to help with tuning and management; a call to cache.stats will return something like:
    {
      hits:         235,
      misses:       312,
      inserts:      255,
      updates:      42,
      evictions:    122,
      expirations:  12,
      size:         199
    };
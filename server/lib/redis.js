'use strict';
const log = require('metalogger')();
const INV_TTL = 2 * 60 * 60;	//2hours is default TTL
const commonPrefix = "commonPrefix";
const redis = require("redis");
const REDIS_CONFIG = require('../../config/redis').DB_CONFIG.REDIS;

let redisClient = (function () {
    let client = {
        get: function(category, key){
            return null;
        },
        set: function(category, key, value, ttl, cb){
            cb(null, null)
        },
        del: function(key, category, cb){
            cb(null, null);
        },
        flushdb: function(db, cb){
            cb(null, null);
        }
    };
    // Start with a fake client so that we have a client that works
    // even when Redis server is down
    let c = redis.createClient({
        host: REDIS_CONFIG.host,
        port: REDIS_CONFIG.port,
        // password: REDIS_CONFIG.password,
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        }

    });
    // Set the "client" variable to the actual redis client instance
    // once a connection is established with the Redis server
    c.on('ready', function () {
		client = c;
    });

    c.on("error", function (err) {
        console.log("Error " + err);
    });
    /**
     * Get a redis client
     * @return {Object} client - eventually a proper redis client object (if redis is up) or a fake client object (if redis is down)
     */
    return {
        getx: function(obj){
            console.log("REDIS_CONFIG",REDIS_CONFIG);
            return new Promise((resolve, reject)=>{
     			log.debug('in function getx in redis');
                var redisPrefix = obj.prefix || commonPrefix;
                var redisKey = redisPrefix + obj.key;
                client.get(redisKey, function(err, reply) {
                    if (err) {
                        var msg = 'Error parsing json from redis' + reply;
                        log.error(err);
                        var error = new Error(msg);
                        reject(error);
                    } else {
                        resolve(reply);
                    }
                });
            });
        },
        setx: function(obj, cb){
            return new Promise((resolve, reject)=>{
                log.debug('in function setx in redis');
                var redisPrefix = obj.prefix || commonPrefix;
                var redisKey = redisPrefix + obj.key;
                client.set(redisKey, obj.value, 'EX', obj.ttl || INV_TTL, function(err, res) {
                    if (err) {
                        log.error(err);
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });
        },
        del: function(key, db, prefix,cb){
            console.log("REDIS_CONFIG",REDIS_CONFIG);
            var redisPrefix = prefix || commonPrefix;
            if(prefix){
                key = prefix + key;
            }else{
                key = redisPrefix + key;
            }
            client.select(db, function() {
                client.set(key, '', 'PX', 1, function(err, reply){  ////can't set it to 0 as it means no expiry
                    cb(err, reply);
                });
            });
        },
        flushdb: function(db, cb){
            client.select(db, function() {
                client.flushdb( function (err, succeeded) {
                    console.log(succeeded); // will be true if successfull
                    cb(err, succeeded);
                });
            });
        }
    };
})();

module.exports = redisClient;

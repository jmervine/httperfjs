var HTTPerf = require('../lib/httperf');
var assert = require('assert');

//process.env.PATH = "./test/support:"+process.env.PATH;

var default_options = {
    'ssl'       : true,
    'server'    : 'github.com',
    'verbose'   : true,
    'hog'       : true,
    'uri'       : '/jmervine/httperfjs'
};

var h, result;

console.log("#runSync -- with parse");
h = new HTTPerf(default_options);
result = h.runSync();
assert(typeof result === 'object', 'missing result');
assert(result.command, 'missing result.command');
assert(result.connection_time_avg, 'missing result.connection_time_avg');
console.log('>> Successful.');

console.log("#runSync -- without parse");
h = new HTTPerf(default_options);
h.parse = false;
result = h.runSync();
assert(typeof result === 'string', 'missing result');
console.log('>> Successful.');

console.log("#run -- with parse");
h = new HTTPerf(default_options);
h.run(function(result) {
    assert(typeof result === 'object', 'missing result');
    assert(result.command, 'missing result.command');
    assert(result.connection_time_avg, 'missing result.connection_time_avg');
    console.log('>> Successful.');


    // without parse after with parse
    console.log("#run -- without parse");
    h = new HTTPerf(default_options);
    h.parse = false;
    h.run(function(result) {
        assert(typeof result === 'string', 'missing result');
        console.log('>> Successful.');

        // sigin test after without parse test
        console.log("#run -- handles SIGINT");
        default_options['num-conns'] = 100;
        h = new HTTPerf(default_options);
        var child = h.run(function(result) {
            assert(typeof result === 'object', 'missing result');
            assert(result.command, 'missing result.command');
            assert(result.connection_time_avg, 'missing result.connection_time_avg');
            console.log('>> Successful.');
        });
        setTimeout(function() {
            child.kill('SIGINT');
        }, 500);
    });
});

// vim: ft=javascript

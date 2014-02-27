var HTTPerf = require('../lib/httperf');
var tape = require('tape');

process.env.PATH = "./test/support:"+process.env.PATH;

var default_options = {
    'server'    : "localhost",
    'port'      : 80,
    'verbose'   : true,
    'hog'       : true,
    'uri'       : "/foo?foo=bar&bar=foo",
    'num-conns' : 10
};

var httperf = new HTTPerf(default_options);
var httperf_san_parse = new HTTPerf(default_options);
httperf_san_parse.parse = false;

tape('HTTPerf', function(group) {
    group.test('command', function(test) {
        test.equal(httperf.command(),
            "httperf --server=localhost --port=80 --verbose --hog --uri='/foo?foo=bar&bar=foo' --num-conns=10");
        test.end();
    });

    group.test('paramsToString', function(test) {
        test.equal(httperf.paramsToString(),
            '--server=localhost --port=80 --verbose --hog --uri=\'/foo?foo=bar&bar=foo\' --num-conns=10');
        test.end();
    });

    group.test('paramsToArray', function(test) {
        test.deepEqual(httperf.paramsToArray(),
            [ '--server', 'localhost', '--port', 80, '--verbose', '--hog',
                '--uri', '/foo?foo=bar&bar=foo', '--num-conns', 10 ]);
        test.end();
    });

    group.test('parse', function(test) {
        test.ok(httperf.parse, 'truthy');
        test.notOk(httperf_san_parse.parse, 'falsy');
        test.end();
    });

    group.test('update_option', function(test) {
        var h = new HTTPerf(default_options);
        h.update_option("num-conns", 100);
        test.equal(100, h.params["num-conns"]);
        test.end();
    });

    group.test('runSync w/ parse', function(test) {
        var result = httperf.runSync();
        test.ok(typeof result === 'object', 'returns object');
        test.ok(result.command, 'has result.command');
        test.ok(result.connection_time_avg, 'has result.connection_time_avg');
        test.end();
    });

    group.test('runSync w/o parse', function(test) {
        var result = httperf_san_parse.runSync();
        test.ok(typeof result === 'string', 'returns object');
        test.end();
    });

    group.test('run w/ parse', function(test) {
        httperf.run( function (result) {
            test.ok(typeof result === 'object', 'returns object');
            test.ok(result.command, 'has result.command');
            test.ok(result.connection_time_avg, 'has result.connection_time_avg');
            test.end();
        });
    });

    group.test('run w/o parse', function(test) {
        httperf_san_parse.run( function (result) {
            test.ok(typeof result === 'string', 'returns object');
            test.end();
        });
    });
});


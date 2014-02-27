var tape = require('tape');

var Parser = require('../lib/httperf').Parser;

var readFileSync = require('fs').readFileSync;

process.env.PATH = "./test/support:"+process.env.PATH;

var default_options = {
    'server'    : "localhost",
    'port'      : 80,
    'uri'       : "/foo?foo=bar&bar=foo",
    'num-conns' : 10
};

var rstub = readFileSync("./test/support/dummy_results.txt").toString();
var vstub = readFileSync("./test/support/dummy_verbose_results.txt").toString();

var parser = new Parser(rstub);


tape('HTTPerf.Parser', function(group) {
    group.test('calculate_percentiles', function(test) {
        test.equal(10, Parser.prototype.calculate_percentiles(85, [10]));
        test.equal(10, Parser.prototype.calculate_percentiles(85, [1,10]));
        test.equal(85, Parser.prototype.calculate_percentiles(85, bigArray()));
        test.end();
    });

    group.test('expressions', function(test) {
        test.equal(50, Object.keys(Parser.prototype.expressions).length);
        test.end();
    });

    group.test('results w/o verbose', function(test) {
        test.ok(parser);
        test.ok(parser.connection_time_avg);
        test.notOk(parser.connection_time_85_pct);
        test.end();
    });

    group.test('results w/ verbose', function(test) {
        var vparser = new Parser(vstub);
        test.ok(vparser);
        test.ok(vparser.connection_time_avg);
        test.ok(vparser.connection_times);
        test.ok(vparser.connection_time_85_pct);
        test.end();
    });
});

// helpers
function bigArray() {
    var a = [];
    for (var i = 1; i < 101; i++) {
        a.push(i);
    }
    return a;
}

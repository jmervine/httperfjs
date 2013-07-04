var HTTPerf = require('lib/httperf');
var Parser  = require('lib/parser');
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

module.exports = {
    initialize: function (test) {
        test.ok(parser);
        test.expect(1);
        test.done();
    },

    calculate_percentiles: function (test) {
        test.equal(10, parser.calculate_percentiles(85, [10]));
        test.equal(10, parser.calculate_percentiles(85, [1,10]));
        test.equal(85, parser.calculate_percentiles(85, bigArray()));
        test.expect(3);
        test.done();
    },

    expressions: function (test) {
        test.equal(50, Object.keys(parser.expressions).length);
        test.done();
    },

    results_without_verbose: function (test) {
        test.ok(parser.results);
        test.ok(parser.results.connection_time_avg);
        test.expect(2);
        test.done();
    },

    results_with_verbose: function (test) {
        var vparser = new Parser(vstub);
        test.ok(vparser.results);
        test.ok(vparser.results.connection_time_avg);
        test.ok(vparser.results.connection_times);
        test.ok(vparser.results.connection_time_85_pct);
        test.expect(4);
        test.done();
    }
};

// helpers
function bigArray() {
    var a = [];
    for (var i = 1; i < 101; i++) {
        a.push(i);
    }
    return a;
}
// vim: ft=javascript

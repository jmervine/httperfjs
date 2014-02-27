var Parser = require('lib/httperf').Parser;
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
    "new Parser(httperf_result_string)": function (test) {
        test.ok(parser);
        test.expect(1);
        test.done();
    },

    "#calculate_percentiles": function (test) {
        test.equal(10, Parser.prototype.calculate_percentiles(85, [10]));
        test.equal(10, Parser.prototype.calculate_percentiles(85, [1,10]));
        test.equal(85, Parser.prototype.calculate_percentiles(85, bigArray()));
        test.expect(3);
        test.done();
    },

    "#expressions": function (test) {
        test.equal(50, Object.keys(Parser.prototype.expressions).length);
        test.done();
    },

    "#results -- without verbose": function (test) {
        test.ok(parser);
        test.ok(parser.connection_time_avg);
        test.expect(2);
        test.done();
    },

    "#results -- with verbose": function (test) {
        var vparser = new Parser(vstub);
        test.ok(vparser);
        test.ok(vparser.connection_time_avg);
        test.ok(vparser.connection_times);
        test.ok(vparser.connection_time_85_pct);
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

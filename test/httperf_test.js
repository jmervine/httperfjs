var HTTPerf = require('lib/httperf');

process.env.PATH = "./test/support:"+process.env.PATH;

var default_options = {
    'server'    : "localhost",
    'port'      : 80,
    'uri'       : "/foo?foo=bar&bar=foo",
    'num-conns' : 10
};

module.exports = {
    initialize: function (test) {
        var h = new HTTPerf(default_options);
        test.equal('localhost', h.params.server);
        test.equal('80', h.params.port);
        test.equal('/foo?foo=bar&bar=foo' , h.params.uri);
        test.equal('10', h.params['num-conns']);
        test.done();
    },

    command: function (test) {
        var h = new HTTPerf(default_options);
        test.equal("httperf --server=localhost --port=80 --uri='/foo?foo=bar&bar=foo' --num-conns=10",
                        h.command());
        test.expect(1);
        test.done();
    },

    paramsToString: function (test) {
        var h = new HTTPerf(default_options);
        test.equal('--server=localhost --port=80 --uri=\'/foo?foo=bar&bar=foo\' --num-conns=10',
                    h.paramsToString());
        test.expect(1);
        test.done();
    },

    parse: function (test) {
        var h = new HTTPerf(default_options);
        test.ok(h.parse);
        h.parse = false;
        test.equal(false, h.parse);
        test.expect(2);
        test.done();
    },

    update_option: function (test) {
        var h = new HTTPerf(default_options);
        h.update_option("num-conns", 100);
        test.equal("100", h.params["num-conns"]);
        test.expect(1);
        test.done();
    },

    run_without_parse: function (test) {
        var h = new HTTPerf(default_options);
        h.parse = false;
        test.ok( h.run().indexOf("httperf --server=localhost --port=80") === 0 );
        test.ok( h.run().indexOf("Connection time [ms]: min 0.2 avg 0.2 max 0.2 median 0.5 stddev 0.0") !== -1 );
        test.expect(2);
        test.done();
    },

    run_with_prase: function (test) {
        var h = new HTTPerf(default_options);
        test.ok( h.run() );
        test.ok( h.run().command );
        test.ok( h.run().connection_time_avg );
        test.expect(3);
        test.done();
    },

    run_with_verbose: function (test) {
        var h = new HTTPerf(default_options);
        test.expect(0);
        test.done();
    },

    run_with_tee: function (test) {
        var h = new HTTPerf(default_options);
        test.expect(0);
        test.done();
    },

    fork: function (test) {
        var h = new HTTPerf(default_options);
        test.expect(0);
        test.done();
    },

};
// vim: ft=javascript

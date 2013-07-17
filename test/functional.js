var HTTPerf = require('../lib/httperf');

var httperf = new HTTPerf({
    "server": "mervine.net",
    "uri": "/about",
    "num-conns": 100}
);

var last_result;

module.exports = {
    'runSync returns results': function (test) {
        test.expect(1);
        var first_run = httperf.runSync();
        test.ok(first_run.connection_time_avg);
        // => connection_time_avg

        test.done();
    },

    'update_option returns new results': function (test) {
        test.expect(2);
        httperf.update_option("uri", "/quotes");

        httperf.run(function (result) {
            test.ok(result.connection_time_avg);
            test.ok(result.command.indexOf("quotes") !== -1);
            test.done();
        });
        // => connection_time_avg

    },

    'run returns new results': function (test) {
        test.expect(2);
        httperf.parse = false;
        httperf.run(function (result) {
            test.ok(result);
            test.ok(result.indexOf("Connection time") !== -1);
            test.done();
        });
        // => connection_time_avg
    }
};



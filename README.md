# HTTPerf.js

[![Build Status](https://travis-ci.org/jmervine/httperfjs.png?branch=master)](https://travis-ci.org/jmervine/httperfjs) &nbsp; [![Dependancy Status](https://david-dm.org/jmervine/httperfjs.png)](https://david-dm.org/jmervine/httperfjs) &nbsp; [![NPM Version](https://badge.fury.io/js/httperfjs.png)](https://badge.fury.io/js/httperfjs)

Simple Node.js interface for httperf. This is a node port of [HTTPerf.rb](http://mervine.net/gems/httperfrb) and
works pretty much the same way.

> What hasn't been ported or is different from the [ruby version](http://mervine.net/gems/httperfrb):
>
> - `parse` is true by default.
> - `tee` isn't currently supported.
> - `httperf` must be in your `PATH`

### Links

* [package](https://npmjs.org/package/httperfjs)
* [source](http://github.com/jmervine/httperfjs)
* [tests](https://travis-ci.org/jmervine/httperfjs)

### Node.js Version

Tested on the following node versions (via [Travis-ci.org](http://travis-ci.org/):

- 0.8
- 0.10

### Installation

    $ npm install httperfjs

### Basic usage:

    :::js
    var HTTPerf = require('httperfjs');

    var httperf = new HTTPerf({
        "server": "mervine.net",
        "verbose": true,
        "hog": true,
        "uri": "/about",
        "num-conns": 100}
    );

    // Note:runSync is far less efficent because of
    // how execSync.exec works. I do not recommend it
    // when running larger/longer tests.
    //
    // This might be removed in a future release.
    var first_run = httperf.runSync();
    console.log(first_run);
    // => { object with httperf values }

    console.log(httperf.results);
    // => { object with httperf values }

    console.log(first_run.connection_time_avg);
    // => '123.4'

    httperf.update_option("uri", "/quotes");

    httperf.run(function (result) {
        console.log(result);
        console.log(result.connection_time_avg);
    });
    // => { object with httperf values }
    // => '123.4'

    httperf.parse = false;
    var child = httperf.run(function (result) {
        console.log(result);
    });
    // => "string with httperf stdout"

    // httperf dumps data on SIGINT (crtl-c), HTTPerf's run
    // supports this as well, with the following addition
    // to your scripts
    process.on('SIGINT', function() {
        child.send('SIGINT');
    });


#### NodeUnit Benchmark Example

    :::js
    // file: ./test/benchmark.js
    var HTTPerf = require('httperfjs');
    var httperf = new HTTPerf({
        server:      "mervine.net",
        uri:         "/",
        "num-conns": 9
    });

    var run;

    module.exports = {
        tearDown: function (callback) {
            run = undefined;
            callback();
        },

        'homepage should be quick': function (test) {
            test.expect(1);
            httperf.run( function (run) {
                test.ok(run.connection_time_median < 200,
                    "homepage was too slow: got " + run.connection_time_median
                       + " but expected: < 200");
                test.done();
            });
        },

        'archive should be quick': function (test) {
            test.expect(1);
            httperf.run( function (run) {
                test.ok(run.connection_time_median < 200,
                    "archive was too slow: got " + run.connection_time_avg
                        + " but expected: < 200");
                test.done();
            });
        }
    };
    // $ ./node_modules/.bin/nodeunit ./test/benchmark.js


#### Parser Keys:

    command
    max_connect_burst_length
    total_connections
    total_requests
    total_replies
    total_test_duration
    connection_rate_per_sec
    connection_rate_ms_conn
    connection_time_min
    connection_time_avg
    connection_time_max
    connection_time_median
    connection_time_stddev
    connection_time_connect
    connection_length
    request_rate_per_sec
    request_rate_ms_request
    request_size
    reply_rate_min
    reply_rate_avg
    reply_rate_max
    reply_rate_stddev
    reply_rate_samples
    reply_time_response
    reply_time_transfer
    reply_size_header
    reply_size_content
    reply_size_footer
    reply_size_total
    reply_status_1xx
    reply_status_2xx
    reply_status_3xx
    reply_status_4xx
    reply_status_5xx
    cpu_time_user_sec
    cpu_time_system_sec
    cpu_time_user_pct
    cpu_time_system_pct
    cpu_time_total_pct
    net_io_kb_sec
    net_io_bps
    errors_total
    errors_client_timeout
    errors_socket_timeout
    errors_conn_refused
    errors_conn_reset
    errors_fd_unavail
    errors_addr_unavail
    errors_ftab_full
    errors_other

#### Verbose Percentile Parser Keys:

These require a non-standard version of `httperf`. See: [httperf-0.9.1 with individual connection times](http://mervine.net/httperf-0-9-1-with-individual-connection-times).

    connection_time_75_pct
    connection_time_80_pct
    connection_time_85_pct
    connection_time_90_pct
    connection_time_95_pct
    connection_time_99_pct


#### Accepted Options:

    "add-header"
    "burst-length"
    "client"
    "close-with-reset"
    "debug"
    "failure-status"
    "hog"
    "http-version"
    "max-connections"
    "max-piped-calls"
    "method"
    "no-host-hdr"
    "num-calls"
    "num-conns"
    "period"
    "port"
    "print-reply"
    "print-request"
    "rate"
    "recv-buffer"
    "retry-on-failure"
    "send-buffer"
    "server"
    "server-name"
    "session-cookies"
    "ssl"
    "ssl-ciphers"
    "ssl-no-reuse"
    "think-timeout"
    "timeout"
    "uri"
    "verbose"
    "version"
    "wlog"
    "wsess"
    "wsesslog"
    "wset"

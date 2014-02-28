var spawn    = require('child_process').spawn;
var Parser   = require('./parser');

/* Valid options:
 * - "add-header"
 * - "burst-length"
 * - "client"
 * - "close-with-reset"
 * - "debug"
 * - "failure-status"
 * - "hog"
 * - "http-version"
 * - "max-connections"
 * - "max-piped-calls"
 * - "method"
 * - "no-host-hdr"
 * - "num-calls"
 * - "num-conns"
 * - "period"
 * - "port"
 * - "print-reply"
 * - "print-request"
 * - "rate"
 * - "recv-buffer"
 * - "retry-on-failure"
 * - "send-buffer"
 * - "server"
 * - "server-name"
 * - "session-cookies"
 * - "ssl"
 * - "ssl-ciphers"
 * - "ssl-no-reuse"
 * - "think-timeout"
 * - "timeout"
 * - "uri"
 * - "verbose"
 * - "version"
 * - "wlog"
 * - "wsess"
 * - "wsesslog"
 * - "wset"
 */
function HTTPerf(opts) {
    var key;
    for (key in opts) {
        this.params[key] = opts[key];
    }
}

/***
 * Support:
 *
 * var Parser = require('httperfjs').Parser;
 *
 * var data = new Parser(' ... raw httperf output ... ');
 * console.log(data);
 ***/
HTTPerf.Parser = Parser;

HTTPerf.prototype = {
    parse:   true,
    params:  {},

    run: function (callback) {
        var that = this;
        var parse = that.parse;

        var stderr = '';
        var stdout = '';

        var child = spawn('httperf', that.paramsToArray(), {
                            detached: true
                          });

        var finished = false;
        function finish(code) {
            if (finished) return;

            finished = true;
            var result;
            if (parse) {
                result = new Parser(stdout);
            } else {
                result = stdout;
            }
            callback(result);
        }

        child.stderr.on('data', function(data) {
            stderr += data;
            stdout += data; // merge stderr to stdout

            if (data.toString().match(/connection failed with unexpected error 99/)) {
                console.error(stderr);
                throw new Error('Out of file descriptors.');
            }
        });

        child.stdout.on('data', function(data) {
            stdout += data;
        });

        child.on('close'   , finish);
        child.on('SIGTERM' , finish);
        child.on('SIGINT'  , finish);
        child.on('exit'    , finish);
        child.on('error'   , finish);


        return child;
    },

    command: function () {
        return "httperf " + this.paramsToString();
    },

    paramsToArray: function () {
        var ret = [];
        for (key in this.params) {
            ret.push("--"+key);
            if (typeof this.params[key] !== 'boolean') {
                ret.push(this.params[key]);
            }
        }
        return ret;
    },

    paramsToString: function () {
        var ret = [];
        var key;
        for (key in this.params) {
            if (key === "uri") {
                ret.push("--"+key+"='"+this.params[key]+"'");
            } else {
                if (this.params[key] === true) {
                    ret.push("--"+key);
                } else {
                    ret.push("--"+key+"="+this.params[key]);
                }
            }
        }
        return ret.join(" ");
    },

    update_option: function (key, val) {
        this.params[key] = val;
    }
};

module.exports = HTTPerf;

// vim: ft=javascript:

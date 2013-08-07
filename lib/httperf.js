var execSync = require('execSync').exec;
var exec     = require('child_process').exec;
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

HTTPerf.prototype = {
    parse:   true,
    params:  {},

    runSync: function () {
        // currently ignoring errors.
        var result = execSync(this.command());

        if (this.parse) {
            return new Parser(result.stdout);
        }
        return result.stdout;
    },

    run: function (callback) {
        var parse = this.parse;
        return exec(this.command(), function (error, stdout, stderr) {
            if (error) {
                throw new Error(error);
            }
            var result;
            if (parse) {
                result = new Parser(stdout);
            } else {
                result = stdout;
            }
            callback(result);
        });
    },

    command: function () {
        return "httperf " + this.paramsToString();
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

var execSync = require('exec-sync');
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
    results: {},
    params:  {},

    runSync: function () {
        // currently ignoring errors.
        var result = execSync(this.command(), true);

        if (this.parse) {
            this.results = new Parser(result.stdout);
        } else {
            this.results = result.stdout;
        }
        return this.results;
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
                ret.push("--"+key+"="+this.params[key]);
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

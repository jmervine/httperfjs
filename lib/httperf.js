var execSync = require('exec-sync');
var Parser   = require('parser');

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
    parse: true,
    results: undefined,

    run: function () {
        // currently ignoring errors.
        var result = execSync(this.command(), true);
        if (this.parse) {
            var parsed = new Parser(result.stdout);
            this.results = parsed;
            return parsed;
        } else {
            this.results = result.stdout;
            return result.stdout;
        }
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
    },

    params: {}
};

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
}

module.exports = HTTPerf;

// vim: ft=javascript:

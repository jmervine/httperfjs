function Parser(raw) {
    var lines = raw.split('\n');
    var matches = {};
    var verbose_connection_times = [];

    for (var i = 0; i < lines.length; i++) {
        var verbose_match = lines[i].match(this.verbose_expression);
        if (verbose_match && verbose_match.length > 0) {
            verbose_connection_times.push(verbose_match[1]);
            continue;
        }

        if (!(lines[i] === '')) {
            Object.keys(this.expressions).forEach( function (key) {
                var regex = Parser.prototype.expressions[key];

                var match = lines[i].match(regex);
                if (match) {
                    matches[key] = match[1];
                    return true;
                }
            });
        }
    }

    if (!(verbose_connection_times.length === 0)) {
        for (var n = 0; n < this.percentiles.length; n++) {
            var pct = this.percentiles[n];
            matches["connection_time_"+pct.toString()+"_pct"] =
                this.calculate_percentiles(pct, verbose_connection_times);
        }
        matches["connection_times"] = verbose_connection_times;
    }
    return matches;
}

Parser.prototype = {
    percentiles: [ 75, 80, 85, 90, 95, 99 ],

    calculate_percentiles: function (pct, values) {
        values.sort(function(a,b) { return a-b })
        if (values.length === 1) {
            return values[0];
        }

        if (values.length === 2) {
            return values[1];
        }

        values.sort();
        return values[Math.round(((values.length / 100) * pct))-1];
    },

    verbose_expression             : /^Connection lifetime = ([0-9]+\.[0-9]+)(\s?)/,

    expressions: {
        command                    : /^(httperf .+)$/,

        // Maximum connect burst length:
        max_connect_burst_length   : /Maximum connect burst length: ([0-9]*?\.?[0-9]+)$/,

        // Total:
        total_connections          : /^Total: connections ([0-9]*?\.?[0-9]+) /,
        total_requests             : /^Total: connections .+ requests ([0-9]*?\.?[0-9]+) /,
        total_replies              : /^Total: connections .+ replies ([0-9]*?\.?[0-9]+) /,
        total_test_duration        : /^Total: connections .+ test-duration ([0-9]*?\.?[0-9]+) /,

        // Connection rate:
        connection_rate_per_sec    : /^Connection rate: ([0-9]*?\.?[0-9]+) /,
        connection_rate_ms_conn    : /^Connection rate: .+ \(([0-9]*?\.?[0-9]+) ms/,

        // Connection time [ms]:
        connection_time_min        : /^Connection time \[ms\]: min ([0-9]*?\.?[0-9]+) /,
        connection_time_avg        : /^Connection time \[ms\]: min .+ avg ([0-9]*?\.?[0-9]+) /,
        connection_time_max        : /^Connection time \[ms\]: min .+ max ([0-9]*?\.?[0-9]+) /,
        connection_time_median     : /^Connection time \[ms\]: min .+ median ([0-9]*?\.?[0-9]+) /,
        connection_time_stddev     : /^Connection time \[ms\]: min .+ stddev ([0-9]*?\.?[0-9]+)$/,
        connection_time_connect    : /^Connection time \[ms\]: connect ([0-9]*?\.?[0-9]+)$/,

        // Connection length [replies/conn]:
        connection_length          : /^Connection length \[replies\/conn\]: ([0-9]*?\.?[0-9]+)$/,

        // Request rate:
        request_rate_per_sec       : /^Request rate: ([0-9]*?\.?[0-9]+) req/,
        request_rate_ms_request    : /^Request rate: .+ \(([0-9]*?\.?[0-9]+) ms/,

        // Request size [B]:
        request_size               : /^Request size \[B\]: ([0-9]*?\.?[0-9]+)$/,

        // Reply rate [replies/s]:
        reply_rate_min             : /^Reply rate \[replies\/s\]: min ([0-9]*?\.?[0-9]+) /,
        reply_rate_avg             : /^Reply rate \[replies\/s\]: min .+ avg ([0-9]*?\.?[0-9]+) /,
        reply_rate_max             : /^Reply rate \[replies\/s\]: min .+ max ([0-9]*?\.?[0-9]+) /,
        reply_rate_stddev          : /^Reply rate \[replies\/s\]: min .+ stddev ([0-9]*?\.?[0-9]+) /,
        reply_rate_samples         : /^Reply rate \[replies\/s\]: min .+ \(([0-9]*?\.?[0-9]+) samples/,

        // Reply time [ms]:
        reply_time_response        : /^Reply time \[ms\]: response ([0-9]*?\.?[0-9]+) /,
        reply_time_transfer        : /^Reply time \[ms\]: response .+ transfer ([0-9]*?\.?[0-9]+)$/,

        // Reply size [B]:
        reply_size_header          : /^Reply size \[B\]: header ([0-9]*?\.?[0-9]+) /,
        reply_size_content         : /^Reply size \[B\]: header .+ content ([0-9]*?\.?[0-9]+) /,
        reply_size_footer          : /^Reply size \[B\]: header .+ footer ([0-9]*?\.?[0-9]+) /,
        reply_size_total           : /^Reply size \[B\]: header .+ \(total ([0-9]*?\.?[0-9]+)\)/,

        // Reply status:
        reply_status_1xx           : /^Reply status: 1xx=([0-9]*?\.?[0-9]+) /,
        reply_status_2xx           : /^Reply status: .+ 2xx=([0-9]*?\.?[0-9]+) /,
        reply_status_3xx           : /^Reply status: .+ 3xx=([0-9]*?\.?[0-9]+) /,
        reply_status_4xx           : /^Reply status: .+ 4xx=([0-9]*?\.?[0-9]+) /,
        reply_status_5xx           : /^Reply status: .+ 5xx=([0-9]*?\.?[0-9]+)/,

        // CPU time [s]:
        cpu_time_user_sec          : /^CPU time \[s\]: user ([0-9]*?\.?[0-9]+) /,
        cpu_time_system_sec        : /^CPU time \[s\]: user .+ system ([0-9]*?\.?[0-9]+) /,
        cpu_time_user_pct          : /^CPU time \[s\]: user .+ \(user ([0-9]*?\.?[0-9]+)\% /,
        cpu_time_system_pct        : /^CPU time \[s\]: user .+ system .+ system ([0-9]*?\.?[0-9]+)\% /,
        cpu_time_total_pct         : /^CPU time \[s\]: user .+ total ([0-9]*?\.?[0-9]+)\%/,

        // Net I/O:
        net_io_kb_sec              : /^Net I\/O: ([0-9]*?\.?[0-9]+) KB/,
        net_io_bps                 : /^Net I\/O: .+ \((.+) bps\)/,

        // Errors:
        errors_total               : /^Errors: total ([0-9]*?\.?[0-9]+) /,
        errors_client_timeout      : /^Errors: total .+ client-timo ([0-9]*?\.?[0-9]+) /,
        errors_socket_timeout      : /^Errors: total .+ socket-timo ([0-9]*?\.?[0-9]+) /,
        errors_conn_refused        : /^Errors: total .+ connrefused ([0-9]*?\.?[0-9]+) /,
        errors_conn_reset          : /^Errors: total .+ connreset ([0-9]*?\.?[0-9]+)/,
        errors_fd_unavail          : /^Errors: fd-unavail ([0-9]*?\.?[0-9]+) /,
        errors_addr_unavail        : /^Errors: fd-unavail .+ addrunavail ([0-9]*?\.?[0-9]+) /,
        errors_ftab_full           : /^Errors: fd-unavail .+ ftab-full ([0-9]*?\.?[0-9]+) /,
        errors_other               : /^Errors: fd-unavail .+ other ([0-9]*?\.?[0-9]+)/
    }
};

module.exports = Parser;

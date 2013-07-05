# HTTPerf.js

This is a node port of [HTTPerf.rb](http://mervine.net/gems/httperfrb) and
works pretty much the same way.

> What hasn't been ported or is different:
>
> - `parse` is true by default.
> - `#fork` isn't currently supported.
> - `tee` isn't currently supported.
>

### Node.js Version

Tests are currently being run and passing on the following versions:
- 0.10.12
- 0.8.25
- 0.6.21

> I have only actually used this on `0.10.12`.

### Basic usage:

    var HTTPerf = require('httperf');

    var httperf = new HTTPerf({
        "server": "mervine.net",
        "uri": "/about",
        "num-conns": 100}
    );

    var first_run = httperf.run();
    first_run
    // => { object with httperf values }

    httperf.results
    // => { object with httperf values }

    first_run.connection_time_avg
    // => '123.4'

    httperf.update_option("uri", "/quotes");

    var second_run = httperf.run();
    second_run
    // => { object with httperf values }

    second_run.connection_time_avg
    // => '123.4'

    httperf.parse = false;
    var third_run = httperf.run();
    third_run
    // => "string with httperf stdout"

    httperf.results
    // => "string with httperf stdout"




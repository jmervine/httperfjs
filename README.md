# HTTPerf.js

This is a node port of [HTTPerf.rb](http://mervine.net/gems/httperfrb) and
works pretty much the same way.

> What hasn't been ported or is different:
>
> - `parse` is true by default.
> - `#fork` isn't currently supported.
> - `tee` isn't currently supported.

### Basic usage:

    var HTTPerf = require('httperf');

    var httperf = new HTTPerf({
        "server": "mervine.net",
        "uri": "/about",
        "num-conns": 100}
    );

    var first_run = httperf.run();
    // => { object with httperf values }

    httperf.update_option("uri", "/quotes");

    var second_run = httperf.run();
    // => { object with httperf values }

    httperf.parse = false;
    var third_run = httperf.run();
    // => "string with httperf stdout"


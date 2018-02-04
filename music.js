const icy = require('icy'),
	lame = require('lame'),
	Speaker = require('speaker');

// URL to a known ICY stream
let url = process.argv['url'];

// connect to the remote stream
icy.get(url, function (res) {

	// log the HTTP response headers
	console.error(res.headers);

	// log any "metadata" events that happen
	res.on('metadata', function (metadata) {
		let parsed = icy.parse(metadata);
		//console.error(parsed);
	});

	// Let's play the music (assuming MP3 data).
	// lame decodes and Speaker sends to speakers!
	res.pipe(new lame.Decoder())
		.pipe(new Speaker());
});

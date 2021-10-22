const icy = require('icy');
const lame = require('lame');
const Speaker = require('speaker');

// URL to a known ICY stream
const url = process.argv.url;

// Connect to the remote stream
icy.get(url, res => {
	// Log the HTTP response headers
	console.error(res.headers);

	// Log any "metadata" events that happen
	res.on('metadata', metadata => {
		const parsed = icy.parse(metadata);
		// Console.error(parsed);
	});

	// Let's play the music (assuming MP3 data).
	// lame decodes and Speaker sends to speakers!
	res.pipe(new lame.Decoder())
		.pipe(new Speaker());
});

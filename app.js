const SuperAgent = require('superagent');
const agent = SuperAgent.agent();
const $ = require('jquery');

let lame = require('lame');
let Speaker = require('speaker');

//const authToken = "yourBase64encoded username:password"; //included via index.html
//const apiHost = "https://api.yourserver.tld"; //included via index.html

let commercials;

class Player {

	constructor(streamURL) {
		this.streamURL = streamURL;
		this.playing = false;
		//this.lastVolume = 1;
	}

	isPlaying() {
		return this.playing;
	}

	play() {
		if (!this.playing) {
			let icy = require('icy');

			this.playing = true;

			let playerRes = (object) => {
				let speaker = new Speaker();
				let decoder = new lame.Decoder();
				return (res) => {
					res.on('data', (chunk) => {
						if(!object.playing) {
							res.socket.pause();
							speaker._unpipe(decoder);
							speaker.close(true);
						}
					});
					res.pipe(decoder)
						.pipe(speaker);
				}
			};

			icy.get(this.streamURL, playerRes(this));
		}
	}

	stop() {
		if (this.playing) {
			this.playing = false;
		}
	}

	/*setVolume(value) {
		this.lastVolume = value;
		if(this.volume) {
			this.volume.setVolume(value);
		}
	}

	getVolume() {
		return this.lastVolume;
	}

	mute() {
		this.lastVolume = 0;
		if(this.volume) {
			this.volume.setVolume(0);
		}
	}*/

}

function serverConnectionTest(callback){
	let connectionCheckToken = randString(18);
	agent
		.get(`${config.apiHost}/api/v2/?random=${connectionCheckToken}`)
		.set('authorization', `Basic ${config.authToken}`)
		.end((err, res)=>{
			if(!err && res.text === connectionCheckToken && typeof callback === "function"){
				callback(res);
			} else
				alert("Fehler bei Verbindung mit Barockoco Webserver, bitte versuchen Sie die Anwendung mit Rechtsklick auf das Icon zu beenden und versuchen Sie es anschließend erneut\n\n BItte prüfen Sie auch, ob die Internetverbindung des Geräts funktioniert.");
		});
}

function getRadioChannels(callback){
	agent
		.get(`${config.apiHost}/api/v2/radiochannels`)
		.end((err, res)=>{
			if(err){
				alert("Es gab einen Fehler beim Versuch die Radiosender abzurufen, Bitte versuchen Sie die Anwendung neuzustarten.");
				return false;
			}
			try {
				if(typeof callback === "function")
					callback(res.text);
			} catch (err) {
				alert("Es gab einen Fehler beim Versuch die Radiosender auszuwerten, Bitte versuchen Sie die Anwendung neuzustarten.\n"+err);
				return false;
			}
		});
}

function getCommercials(callback){
	agent
		.get(`${config.apiHost}/api/v2/radiocommercials`)
		.end((err, res)=>{
			callback(res.text)
		});
}

function randString(length){
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

function init(){
	serverConnectionTest(()=>{
		getRadioChannels((channels)=>{
			let channelsParsed = JSON.parse(channels);
			//console.dir(channelsParsed);
			if(channelsParsed.every((next)=>{
				//console.dir(next);
				let dom = $(`
<div class="channel" style="background-color: ${next.color};">
	<div class="title">${next.title}</div>
	<div class="play-button" data-url="${next.url}">&#9654;</div>
	<div class="stop-button" style="display:none;">&#9726;</div>
</div>`);
				dom.appendTo('#music-sidebar');
				return true
			})){
				$('.play-button').on('click', (event)=>{
					let me = $(event.target);
					let url = me.data('url');

					$('.stop-button').hide();
					$('.play-button').show();

					me.hide();
					me.siblings('.stop-button').show();

					if(player.isPlaying()){
						player.stop();
					}
					player = new Player(url);
					player.play();
				});
				$('.stop-button').on('click', ()=>{
					$('.stop-button').hide();
					$('.play-button').show();

					if(player.isPlaying()){
						player.stop();
					}
				});
				setTimeout(()=>{
					getCommercials((res)=>{
						$('header').hide();
						commercials = JSON.parse(res);
						$('section').append($(`<img id="switch-picture" src="${commercials[0].picture}" width="${window.innerWidth}px" height="${window.innerHeight}px">`));

						setInterval(()=>{
							let neu = commercials[Math.floor(Math.random() * commercials.length)];
							$('#switch-picture').attr('src', neu.picture);
						}, 1000*60*3)
					});
				}, 3000);
			}
			player = new Player("");
			window.onunload = function () {
				player.stop()
			};
		});
	});

}

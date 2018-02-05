'use strict';
const electron = require('electron');

const {app, autoUpdater, dialog} = require('electron');

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

const isDev = require('electron-is-dev'), paidCertIsAvailable = false;

if (!isDev && paidCertIsAvailable) {
	//auto updater here:
	const appVersion = require('./package.json').version;
	const config = require('./config.json');
	let updateFeed = `${config.apiHost}/api/v2/barockoco-music-updates/latest`;

	autoUpdater.setFeedURL(updateFeed + '?v=' + appVersion, {"authorization": `Basic ${config.authToken}`});


	autoUpdater.on('error', (err)=>{
		console.log("Es ist ein Fehler bei Auto-Update aufgetreten: ", err);
	});
	autoUpdater.on('checking-for-update', ()=>{
		console.log("Prüfe auf Updates...");
	});
	autoUpdater.on('update-available', ()=>{
		console.log("Update verfügbar, starte Download...");
	});
	autoUpdater.on('update-not-available', ()=>{
		console.log("Kein Update verfügbar.");
	});
	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
		console.log("Update wurde heruntergeladen.");
		const dialogOpts = {
			type: 'info',
			buttons: ['Installieren', 'Später'],
			title: 'Update',
			message: process.platform === 'win32' ? releaseNotes : releaseName,
			detail: 'Ein Update für Barockoco Music ist verfügbar, möchten Sie die Anwendung jetzt neustarten um die neue Version zu verwenden?'
		};

		dialog.showMessageBox(dialogOpts, (response) => {
			if (response === 0) autoUpdater.quitAndInstall()
		});
	});

	autoUpdater.checkForUpdates();
}

// /end auto update

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1000,
		height: 600
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	mainWindow.setFullScreen(true);
});

# Barockoco Music

> Radiostations and advertisement

![Sample](./sample-image.png)

![Showcase](./Kapture.mp4)

App expects api to serve:

### `/api/v2/?random=${connectionCheckToken}`
response should be content of `connectionCheckToken`

## Updates
For Updates you need a valid Apple Developer ID. I found these resources helpful:
- https://pracucci.com/atom-electron-signing-mac-app.html
- https://help.apple.com/xcode/mac/current/#/dev3a05256b8
- https://github.com/iffy/electron-updater-example
- https://developer.apple.com/account/mac/certificate/distribution 

long story short, get a cert: "macOS Production Developer ID", import to keychain and after build of .app execute `codesign --deep --force --verbose --sign "Your Company Name / Cert Name (MV*******)" "dist/App Name-os-stuff/App Name.app"`.
I attached it with `&&` to my npm-build-script.

When I tried to serve the Updater I had problems hosting the .app-"File" which is recognized as a folder on all other OSs other than macOS. I just zipped the .app and served it, which works like a charm.
 
### `/api/v2/radiochannels`

```
[
	{
		"title": "My Channel",
		"url": "https://my.radiostati.on/path",
		"color": "#FF0000"
	}
]
```

### `/api/v2/radiocommercials`

```
[
	{
		"title": "my ad",
		"picture": "https://my.radiostati.on/images/pic_1920x1080.jpg"
	}
]
```

### Todos
- Enable Auto-Update after aquired paid Apple Developer Cert

## Dev

```
$ npm install
```

### Run

```
$ npm start
```

### Build

```
$ npm run build
```

Builds the app for macOS, Linux, and Windows, using [electron-packager](https://github.com/electron-userland/electron-packager).


## License

MIT © [Oliver Möller](https://github.com/phenyll)

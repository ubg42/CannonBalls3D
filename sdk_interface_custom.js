// GAME-SPECIFIC SETTINGS / OVERRIDES

SDK_INTERFACE_SETTINGS.isProd = true;

if(SDK_INTERFACE_SETTINGS.isProd) {
	// PRODUCTION
	SDK_INTERFACE_SETTINGS.debugLevel = 0;
	SDK_INTERFACE_SETTINGS.forceMockObject = false;
} else {
	// TESTING
	SDK_INTERFACE_SETTINGS.debugLevel = 2;
	SDK_INTERFACE_SETTINGS.forceMockObject = true;
}

// game specifics
SDK_INTERFACE_SETTINGS.setVolume = false; // set to 'true' if game supports setVolume
SDK_INTERFACE_SETTINGS.hasScore = true; // if 'false' use incrementing score upon the completion of each level

// overrides
SDK_INTERFACE_OVERRIDES.famobi.showInterstitialAd = (eventId, callback) => {
	let params = {};

	if(typeof eventId === "object") {
	    params = eventId;
	} else {
	    params.callback = typeof eventId === "function" ? eventId : typeof callback === "function" ? callback : undefined;
	    params.eventId = typeof eventId === "string" ? eventId : typeof callback === "string" ? callback : undefined;
	}

	/*
		'preroll': before the game loads (before UI has rendered)
		'start': before the gameplay starts (after UI has rendered)
		'pause': the player pauses the game
		'next': player navigates to the next level
		'browse': the player explores options outside of the gameplay
	*/

	SDK_INTERFACE_HELPERS.adBreak.type = null;

	switch(params.eventId.toLowerCase()) {
		case "preroll":
			SDK_INTERFACE_HELPERS.adBreak.type = "preroll";
			break;
		case "button:main:start":
		case "button:defeat:restart":
			SDK_INTERFACE_HELPERS.adBreak.type = "start";
			break;
		case "button:results:nextlevel":
			SDK_INTERFACE_HELPERS.adBreak.type = "next";
			break;
		case "button:level:menu":
			SDK_INTERFACE_HELPERS.adBreak.type = "pause";
			break;

		case "button:level:delete":
			SDK_INTERFACE_HELPERS.game.gameOver();
			break;
		case "button:level:tutorial":
		case "button:level:camera":

		case "button:main:category":
		case "button:main:page":

			SDK_INTERFACE_HELPERS.adBreak.type = "browse";
			break;
		default:
			// do nothing
	}

	if(SDK_INTERFACE_HELPERS.adBreak.type !== null) {
		window.famobi.showAd(() => {
			if(typeof params.callback === "function") {
			    params.callback();
			}
		});
	} else {
		SDK_INTERFACE.getDebugLevel() && console.log("showInterstitialAd('%s')", params.eventId);
		if(typeof params.callback === "function") {
		    params.callback();
		}
	}

	return Promise.resolve();
}

SDK_INTERFACE_OVERRIDES.famobi_analytics.trackEvent = (event, params) => {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE.getDebugLevel() && console.log(event, params);

		switch(event) {
			case "EVENT_LIVESCORE":
				SDK_INTERFACE_HELPERS.score.update(params.liveScore);
				break;

			case "EVENT_LEVELSCORE":
				SDK_INTERFACE_HELPERS.score.update(params.levelScore);
				break;

			case "EVENT_TOTALSCORE":
				SDK_INTERFACE_HELPERS.score.update(params.totalScore);
				break;

			case "EVENT_LEVELFAIL":
				SDK_INTERFACE_HELPERS.game.gameOver();
				break;

			case "EVENT_LEVELSUCCESS":
				SDK_INTERFACE_HELPERS.game.levelComplete(params.levelName);
				break;

			default:
				// do nothing
		};

		return resolve(event, params);
	});
};

SDK_INTERFACE_OVERRIDES.famobi_analytics.trackScreen = (screen, pageTitle) => {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE.getDebugLevel() && console.log(screen, pageTitle);

		switch(screen) {
			case "SCREEN_HOME":
				// ...
				break;
			default:
				// ...
		}

		return resolve(screen, pageTitle);
	});
};
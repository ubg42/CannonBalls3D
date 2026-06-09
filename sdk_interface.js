/*
	SETTINGS
 */
const SDK_INTERFACE_SETTINGS = {

	isProd: true,
	debugLevel: 0,
	forceMockObject: false,

	// ads
	interstitial: {
		enabled: true, // enable/disable interstitial ads
		initial: true, // show initial ad
		preload: 250, // preload interval in ms
		retry: 2000, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		cooldown: 0, // time between ads
		attempts: 0 // retry limit
	},
	rewarded: {
		enabled: true, // enable/disable rewarded ads
		preload: 250, // preload interval in ms
		retry: 250, // timeout before retry after preload fail
		timout: 250, // timout before calling showRewarded()
		reward: true, // reward when in doubt
		attempts: 0 // retry limit
	},

	// files to load
	externalFiles: ["html5games/gameapi/tresor.js", "sdk_interface_custom.js"],

	// features
	features: {
		auto_quality: false,
		copyright: false,
		credits: false,
		external_achievements: false,
		external_leaderboard: false,
		external_mute: true,
		external_pause: false,
		external_start: false,
		forced_mode: false,
		leaderboard: false,
		multiplayer: false,
		multiplayer_local: true,
		skip_title: false,
		skip_tutorial: false,
		rewarded: true,
		highscores: true
	},
	// forced mode
	forced_mode: {

	},

	// misc
	aid: "A1234-5", // affiliate id
	name: "Famobi", // name of partner/customer
	branding_url: "",
	branding_image: "logo", // "logo" = transparent
	show_splash: false,
	menuless: true,

	isRewardedAdOpportunity: false
};

const SDK_INTERFACE_HELPERS = {

	game: {

		hasReadyCalled: false,
		levelCompletionScore: 0,

		ready: function() {
			if(!this.hasReadyCalled) {
				this.hasReadyCalled = true;

				!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.ready()', 'background: red; color: #bada55');
				try {
					GameSnacks.game.ready();
				} catch(e) {}
			}
		},
		levelComplete: function(level) {

			level = this.getLevel(level);

			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.levelComplete(%s)', 'background: red; color: #bada55', level);
			try {
				GameSnacks.game.levelComplete(level);
			} catch(e) {}

			if(SDK_INTERFACE_SETTINGS.hasScore === false) {
				this.levelCompletionScore++;
				SDK_INTERFACE_HELPERS.score.update(this.levelCompletionScore);
			}
		},
		gameOver: function() {
			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.gameOver()', 'background: red; color: #bada55');
			try {
				GameSnacks.game.gameOver();
			} catch(e) {}
		},

		getLevel: function(levelName) {

			let lvl = 0;

			switch(window.famobi_gameID) {

				case "color-pixel-art-classic":
					const levels = {
						"animal": 150,
						"plant": 110,
						"food": 130,
						"human": 116,
						"monster": 84,
						"vehicle": 76,
						"random": 144,
						"christmas": 68,
						"halloween": 58
					};

					for(let cat in levels) {
						if(levelName.startsWith(cat)) {
							lvl += parseInt(levelName.replace(/\D/g, ""));
							break;
						}
						lvl += levels[cat];
					}
					break;
				default:
					lvl = parseInt(levelName.replace(/\D/g, ""));
			}
			return lvl;
		}
	},
	score: {
		update: function(score) {
			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel > 1 && console.log('%c GameSnacks.score.update(%s)', 'background: red; color: #bada55', score);
			try {
				GameSnacks.score.update(score);
			} catch(e) {}
		}
	},
	storage: {
		setItem: function(key, value) {
			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel > 1 && console.log('%c GameSnacks.storage.setItem(%s, %s)', 'background: red; color: #bada55', key, value);
			try {
				GameSnacks.storage.setItem(key, value);
			} catch(e) {
			}
		},
		getItem: function(key) {
			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel > 1 && console.log('%c GameSnacks.storage.getItem(%s)', 'background: red; color: #bada55', key);
			try {
				return GameSnacks.storage.getItem(key);
			} catch(e) {
				return null;
			}
		}
	},
	audio: {
		
		callback: null,

		subscribe: function(callback) {
			!SDK_INTERFACE_SETTINGS.forceMockObject && SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.audio.subscribe()', 'background: red; color: #bada55');

			try {
				GameSnacks.audio.subscribe(callback);
			} catch(e) {}
		},

		subscription: function(isAudioEnabled) {
			if(typeof this.callback === "function") {
				this.callback(isAudioEnabled);
			}
		}
	},

	adBreak: {
		reward: {
		},
		interstitial: {
		}
	}
};

const SDK_INTERFACE_OVERRIDES = {
	famobi: {

		getCurrentLanguage: function() {
			return "en";
		},

		/*
		setPreloadProgress: function(progress) {

		},
		*/

		gameReady: function() {
			SDK_INTERFACE_HELPERS.game.ready();
		},

		/*
		playerReady: function(progress) {

		},
		*/
	},
	famobi_analytics: {
		trackEvent: function(event, params) {

			SDK_INTERFACE.settings.debugLevel && console.log(event);

			return new Promise(function(resolve, reject) {
				return resolve(event, params);
			});
		}
	}
}

const SDK_INTERFACE_PRELOAD_AD = function(type) {

	return new Promise(function(resolve, reject) {

		if(type === "rewarded") {

			SDK_INTERFACE_HELPERS.adBreak.reward.beforeReward = showAdFn => {

				SDK_INTERFACE_HELPERS.adBreak.reward.beforeReward = null;

				SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn = showAdFn;
				if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn === "function") {
					resolve();
				} else {
					reject();
				}
			};

        	GameSnacks.ad.break({
        		type: 'reward',
				beforeAd: () => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.beforeAd [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.beforeAd === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.beforeAd();
					}
				},
				afterAd: () => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.afterAd [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.afterAd === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.afterAd();
					}
				},
				beforeReward: showAdFn => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.beforeReward [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.beforeReward === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.beforeReward(showAdFn);
					}
				},
				adDismissed: () => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.adDismissed [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.adDismissed === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.adDismissed();
					}
				},
				adViewed: () => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.adViewed [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.adViewed === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.adViewed();
					}
				},
				adBreakDone: placementInfo => {
					SDK_INTERFACE.settings.debugLevel && console.log("ad.break.adBreakDone [reward]");
					if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.adBreakDone === "function") {
						SDK_INTERFACE_HELPERS.adBreak.reward.adBreakDone(placementInfo);
					}
				}
        	});

		} else {
			resolve();
		}
	});
};

const SDK_INTERFACE_SHOW_AD = function() {

	return new Promise(function(resolve, reject) {

		SDK_INTERFACE_HELPERS.adBreak.interstitial.afterAd = () => {
			resolve();
		};

    	GameSnacks.ad.break({
    		type: SDK_INTERFACE_HELPERS.adBreak.type || "browse",
			beforeAd: () => {
				SDK_INTERFACE.settings.debugLevel && console.log("ad.break.beforeAd [interstitial]");
				if(typeof SDK_INTERFACE_HELPERS.adBreak.interstitial.beforeAd === "function") {
					SDK_INTERFACE_HELPERS.adBreak.interstitial.beforeAd();
				}
			},
			afterAd: () => {
				SDK_INTERFACE.settings.debugLevel && console.log("ad.break.afterAd [interstitial]");
				if(typeof SDK_INTERFACE_HELPERS.adBreak.interstitial.afterAd === "function") {
					SDK_INTERFACE_HELPERS.adBreak.interstitial.afterAd();
				}
			},
			adBreakDone: placementInfo => {
				SDK_INTERFACE.settings.debugLevel && console.log("ad.break.adBreakDone [interstitial]");
				if(typeof SDK_INTERFACE_HELPERS.adBreak.interstitial.adBreakDone === "function") {
					SDK_INTERFACE_HELPERS.adBreak.interstitial.adBreakDone(placementInfo);
				}
			}
    	});
	});
};

const SDK_INTERFACE_REWARDED_AD = function() {

	return new Promise(function(resolve, reject) {

		isRewardGranted = SDK_INTERFACE_SETTINGS.rewarded.reward;

		SDK_INTERFACE_HELPERS.adBreak.reward.adViewed = () => {
			SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn = null;
			SDK_INTERFACE_HELPERS.adBreak.reward.adViewed = null;
			isRewardGranted = true;
		};

		SDK_INTERFACE_HELPERS.adBreak.reward.adDismissed = () => {
			SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn = null;
			SDK_INTERFACE_HELPERS.adBreak.reward.adDismissed = null;
			isRewardGranted = false;
		};

		SDK_INTERFACE_HELPERS.adBreak.reward.afterAd = () => {
			SDK_INTERFACE_HELPERS.adBreak.reward.afterAd = null;
			resolve(isRewardGranted);
		};

		if(typeof SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn === "function") {
			SDK_INTERFACE_HELPERS.adBreak.reward.showAdFn();
		}
	});
};

const SDK_INTERFACE_MOCK_OBJECT = function() {
	return new Promise(function(resolve, reject) {
		window.GameSnacks = {

			game: {
				ready: function() {
					SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.ready()', 'background: red; color: #bada55');
				},
				levelComplete: function(level) {
					SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.levelComplete(%s)', 'background: red; color: #bada55', level);
				},
				gameOver: function() {
					SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.game.gameOver()', 'background: red; color: #bada55');
				}
			},
			audio: {
				isEnabled: function() {
					return false;
				},
				subscribe: function(callback) {
					SDK_INTERFACE_HELPERS.audio.callback = callback;
				}
			},
			ad: {
				break: function(adBreak) {

					if(adBreak.type === "reward") {

						if(typeof adBreak.beforeAd === "function") {
							adBreak.beforeAd();
						}

						if(typeof adBreak.beforeReward === "function") {
							adBreak.beforeReward(() => {
								if(confirm("Rewarded ad ended. Should a reward be granted?")) {
									if(typeof adBreak.adViewed === "function") {
										adBreak.adViewed();
									}
								} else {
									if(typeof adBreak.adDismissed === "function") {
										adBreak.adDismissed();
									}
								}

								if(typeof adBreak.afterAd === "function") {
									adBreak.afterAd();
								}
							});
						}

						if(typeof adBreak.adBreakDone === "function") {
							adBreak.adBreakDone();
						}

					} else {
						if(typeof adBreak.beforeAd === "function") {
							adBreak.beforeAd();
						}

						alert("This is an ad [" + adBreak.type + "]!");

						if(typeof adBreak.afterAd === "function") {
							adBreak.afterAd();
						}

						if(typeof adBreak.adBreakDone === "function") {
							adBreak.adBreakDone();
						}
					}
				}
			},
			score: {
				update: function(score) {
					SDK_INTERFACE.settings.debugLevel && console.log('%c GameSnacks.score.update(%s)', 'background: red; color: #bada55', score);
				}
			},
			storage: {
				mockStorage: {},

				getItem: function(key) {
					return this.mockStorage[key] || null;
				},
				setItem: function(key, value) {
					this.mockStorage[key] = ""+value;
				}
			}
		};
		resolve();
	});
};

const SDK_INTERFACE_INIT = function() {
	return new Promise(function(resolve, reject) {

		window.TRESOR.init({
			storageType: window.TRESOR.STORAGES.GAMESNACKS,
			fallback: false,
			log: !!SDK_INTERFACE.settings.debugLevel,
			async: false
		}).then(() => {
			SDK_INTERFACE.settings.debugLevel && console.log("overwriting famobi.localStorage...");
			window.famobi.localStorage = {
				setItem: function(key, value) {
					SDK_INTERFACE.settings.debugLevel && console.log("window.famobi.localStorage.setItem('%s', '%s')", key, value)
					window.TRESOR.setItem(key, value);
				},
				getItem: function(key) {
					return window.TRESOR.getItem(key);
				},
				removeItem: function(key) {
					window.TRESOR.removeItem(key);
				},
				getKeys: function() {
					return window.TRESOR.keys();
				},
				clear: function() {
					window.TRESOR.clear();
				} 
			};
		}).catch(e => {});

		SDK_INTERFACE_HELPERS.audio.subscribe((isAudioEnabled) => {

			if(SDK_INTERFACE_SETTINGS.setVolume) {
				SDK_INTERFACE.settings.debugLevel && console.log("window.famobi.setVolume(%s)", isAudioEnabled ? 1.0 : 0.0)
				window.famobi.setVolume(isAudioEnabled ? 1.0 : 0.0);
				return;
			}

			SDK_INTERFACE.settings.debugLevel && console.log("window.famobi.adapters.run('request', %s)", isAudioEnabled ? "enableAudio" : "disableAudio");
			window.famobi.adapters.run("request", isAudioEnabled ? "enableAudio" : "disableAudio");
			SDK_INTERFACE.settings.debugLevel && console.log("window.famobi.adapters.run('request', %s)", isAudioEnabled ? "enableAMusic" : "disableMusic");
			window.famobi.adapters.run("request", isAudioEnabled ? "enableAMusic" : "disableMusic");
		});

		window.famobi.audio = window.famobi.audio || {

			controls: false,
			bgm: true,
			sfx: true,

			init: function() {
				// do something
			},
			hasControls: function() {
				return this.controls;
			},
			isEnabled: function(type) {
				switch(type) {
					case "bgm":
						// return this.bgm;
					case "sfx":
						// return this.sfx;
					default:
						// return this.bgm && this.sfx;
						return GameSnacks.audio.isEnabled();
				}
			}
		};

		SDK_INTERFACE.settings.isRewardedAdOpportunity = true;

		SDK_INTERFACE._hasRewardedAd = function() {
			return SDK_INTERFACE.settings.isRewardedAdOpportunity && SDK_INTERFACE.settings.rewarded.state === SDK_INTERFACE.AD_STATES.READY && SDK_INTERFACE.hasCooledDown("rewarded");
		};

		resolve();
	});
};

SDK_INTERFACE.init(SDK_INTERFACE_SETTINGS);

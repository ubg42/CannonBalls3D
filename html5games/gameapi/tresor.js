window["TRESOR"] = (

	function () {

		let log = false;
		let initialized = false;
		let compression = null;
		let debugging = false;
		let async = true;

		let STORAGE;

		let LZString;

		const STORAGES = {

			"SESSION": 0,
	        "LOCALSTORAGE": 1,
	        "YTGAME": 2,
	        "GAMESNACKS": 3,
	        "FAMOBI": 4,
	        "WAKOOL": 5,

	        0: "SESSION",
	        1: "LOCALSTORAGE",
	        2: "YTGAME",
	        3: "GAMESNACKS",
	        4: "FAMOBI",
	        5: "WAKOOL"
		};

		const testKey = "__test__";

		function init(_storageType = 0, _fallback = false, _log = false, _async = true, _compression = null) {

			if(typeof _storageType === "object") {
				storageType = _storageType.storageType || 0;
				fallback = _storageType.fallback || false;
				log = _storageType.log || false;
				async = !!_storageType.async;
				compression = _storageType.compression || null;
			} else {
				storageType = _storageType || 0;
				fallback = _fallback || false;
				log = _log || false;
				async = !!_async;
				compression = _compression || null;
			}

			switch(compression) {
				case "lz-string":
					/**
					 * lz-string 1.5.0 (https://github.com/pieroxy/lz-string/)
					 **/
					LZString=function(){var r=String.fromCharCode,o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={};function t(r,o){if(!e[r]){e[r]={};for(var n=0;n<r.length;n++)e[r][r.charAt(n)]=n}return e[r][o]}var i={compressToBase64:function(r){if(null==r)return"";var n=i._compress(r,6,function(r){return o.charAt(r)});switch(n.length%4){default:case 0:return n;case 1:return n+"===";case 2:return n+"==";case 3:return n+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(n){return t(o,r.charAt(n))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(r){return null==r?"":""==r?null:i._decompress(r.length,16384,function(o){return r.charCodeAt(o)-32})},compressToUint8Array:function(r){for(var o=i.compress(r),n=new Uint8Array(2*o.length),e=0,t=o.length;e<t;e++){var s=o.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null==o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;e<t;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(r){return null==r?"":i._compress(r,6,function(r){return n.charAt(r)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(o){return t(n,r.charAt(o))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(r,o,n){if(null==r)return"";var e,t,i,s={},u={},a="",p="",c="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<r.length;i+=1)if(a=r.charAt(i),Object.prototype.hasOwnProperty.call(s,a)||(s[a]=f++,u[a]=!0),p=c+a,Object.prototype.hasOwnProperty.call(s,p))c=p;else{if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++),s[p]=f++,c=String(a)}if(""!==c){if(Object.prototype.hasOwnProperty.call(u,c)){if(c.charCodeAt(0)<256){for(e=0;e<h;e++)m<<=1,v==o-1?(v=0,d.push(n(m)),m=0):v++;for(t=c.charCodeAt(0),e=0;e<8;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;e<h;e++)m=m<<1|t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=c.charCodeAt(0),e=0;e<16;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}0==--l&&(l=Math.pow(2,h),h++),delete u[c]}else for(t=s[c],e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;0==--l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;e<h;e++)m=m<<1|1&t,v==o-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==o-1){d.push(n(m));break}v++}return d.join("")},decompress:function(r){return null==r?"":""==r?null:i._decompress(r.length,32768,function(o){return r.charCodeAt(o)})},_decompress:function(o,n,e){var t,i,s,u,a,p,c,l=[],f=4,h=4,d=3,m="",v=[],g={val:e(0),position:n,index:1};for(t=0;t<3;t+=1)l[t]=t;for(s=0,a=Math.pow(2,2),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;c=r(s);break;case 2:return""}for(l[3]=c,i=c,v.push(c);;){if(g.index>o)return"";for(s=0,a=Math.pow(2,d),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;switch(c=s){case 0:for(s=0,a=Math.pow(2,8),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 1:for(s=0,a=Math.pow(2,16),p=1;p!=a;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=e(g.index++)),s|=(u>0?1:0)*p,p<<=1;l[h++]=r(s),c=h-1,f--;break;case 2:return v.join("")}if(0==f&&(f=Math.pow(2,d),d++),l[c])m=l[c];else{if(c!==h)return null;m=i+i.charAt(0)}v.push(m),l[h++]=i+m.charAt(0),i=m,0==--f&&(f=Math.pow(2,d),d++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module?module.exports=LZString:"undefined"!=typeof angular&&null!=angular&&angular.module("LZString",[]).factory("LZString",function(){return LZString});
					break;
				default:
					// do nothing
			}

			return new Promise((resolve, reject) => {

				log && console.log("[tresor] initializing...");
				setDriver(storageType, fallback).then(
					() => {
						log && console.log("[tresor] ok");
						initialized = true;
						resolve();
					},
					() => {
						log && console.log("[tresor] failed");
						reject();
					}
				);
			});
		};

		function compress(str) {
			switch(compression) {
				case "lz-string":
					debugging && console.log("compress data (%s):", compression);
					debugging && console.log(str);
					str = LZString.compress(str);
					debugging && console.log(str);
					return str;
				default:
					return str;
			}
		};

		function decompress(str) {
			switch(compression) {
				case "lz-string":
					debugging && console.log("decompress data (%s):", compression);
					debugging && console.log(str);
					str = LZString.decompress(str);
					debugging && console.log(str);
				default:
					return str;
			}
		}

		function setDriver(storageType = 0, fallback = true) {

			// SESSION STORAGE
			const SESSION_STORAGE = {

				data: {},

				init: function() {
					return Promise.resolve();
				},
				setItem: function(keyPrefix, value) {
					this.data[keyPrefix] = value;
					return Promise.resolve({});
				},
				getItem: function(keyPrefix) {
					return Promise.resolve({"value": this.data[keyPrefix] || null});
				},
				removeItem: function(keyPrefix) {
					delete this.data[keyPrefix];
					return Promise.resolve({});
				},
				keys: function() {
					return Promise.resolve({"keys": Object.keys(this.data)});
				},
				clear: function() {
					this.data = {};
					return Promise.resolve({});
				}
			};

			// YTGAME STORAGE
			const YTGAME_STORAGE = {

				data: {},

				init: function() {
					return new Promise(resolve => {
						window["ytgame"]["game"]["loadData"]().then(data => {
							try{
								this.data = JSON.parse(decompress(data));
								if(this.data === null) {
									this.data = {};
								}
							} catch(e) {
								this.data = {};
							}
							resolve();
						});
					});
				},
				setItem: function(keyPrefix, value) {
					return new Promise(resolve => {
						this.data[keyPrefix] = value;
						window["ytgame"]["game"]["saveData"](compress(JSON.stringify(this.data))).then(
							() => {resolve({})},
							e => {resolve({"err": e})});
					});
				},
				getItem: function(keyPrefix) {
					return Promise.resolve({"value": this.data[keyPrefix] || null});
				},
				removeItem: function(keyPrefix) {
					delete this.data[keyPrefix];
					return new Promise(resolve => {
						window["ytgame"]["game"]["saveData"](compress(JSON.stringify(this.data))).then(
							() => {resolve({})},
							e => {resolve({"err": e})});
					});
				},
				keys: function() {
					return Promise.resolve({"keys": Object.keys(this.data)});
				},
				clear: function() {
					this.data = {};
					return new Promise(resolve => {
						window["ytgame"]["game"]["saveData"](compress(JSON.stringify(this.data))).then(
							() => {resolve({})},
							e => {resolve({"err": e})});
					});
				}
			};

			// LOCALSTORAGE
			const LOCAL_STORAGE = {

				data: {},

				init: function() {
					return new Promise(resolve => {
						window["localStorage"]["setItem"](testKey, testKey);
						window["localStorage"]["removeItem"](testKey);
						resolve();
					});
				},
				setItem: function(keyPrefix, value) {
					window["localStorage"]["setItem"](keyPrefix, value);
					return Promise.resolve({});
				},
				getItem: function(keyPrefix) {
					let value = window["localStorage"]["getItem"](keyPrefix);
					return Promise.resolve({"value": value || null});
				},
				removeItem: function(keyPrefix) {
					window["localStorage"]["removeItem"](keyPrefix);
					return Promise.resolve({});
				},
				keys: function() {

					function getAllLocalStorageKeys() {
						const keys = [];
						const len = window["localStorage"].length;
						for (let i = 0; i < len; i++) {
							keys.push(window["localStorage"]["key"](i));
						}
						return keys;
					}

					return Promise.resolve({"keys": getAllLocalStorageKeys()});
				},
				clear: function() {
					window["localStorage"]["clear"]();
					return Promise.resolve({});
				}
			};

			// GAMESNACKS STORAGE
			const GAMESNACKS_STORAGE = {

				data: {},

				init: function() {
					return new Promise(resolve => {

						let data = window["GameSnacks"]["storage"]["getItem"]("savegame");

						try{
							this.data = JSON.parse(decompress(data));
							if(this.data === null) {
								this.data = {};
							}
						} catch(e) {
							this.data = {};
						}
						resolve();
					});
				},
				setItem: function(keyPrefix, value) {
					return new Promise(resolve => {
						this.data[keyPrefix] = value;
						try{
							window["GameSnacks"]["storage"]["setItem"]("savegame", compress(JSON.stringify(this.data)));
							resolve({});
						} catch(e) {
							resolve({"err": e});
						}
					});
				},
				getItem: function(keyPrefix) {
					return Promise.resolve({"value": this.data[keyPrefix] || null});
				},
				removeItem: function(keyPrefix) {
					return new Promise(resolve => {
						delete this.data[keyPrefix];
						try{
							window["GameSnacks"]["storage"]["setItem"]("savegame", compress(JSON.stringify(this.data)));
							resolve({});
						} catch(e) {
							resolve({"err": e});
						}
					});
				},
				keys: function() {
					return Promise.resolve({"keys": Object.keys(this.data)});
				},
				clear: function() {
					this.data = {};
					window["GameSnacks"]["storage"]["clear"]();
					return Promise.resolve({});
				}
			};

			// FAMOBI STORAGE
			const FAMOBI_STORAGE = {

				data: {},

				init: function() {
					return new Promise(resolve => {
						window["famobi"]["localStorage"]["setItem"](testKey, testKey);
						window["famobi"]["localStorage"]["removeItem"](testKey);
						resolve();
					});
				},
				setItem: function(keyPrefix, value) {
					window["famobi"]["localStorage"]["setItem"](keyPrefix, value);
					return Promise.resolve({});
				},
				getItem: function(keyPrefix) {
					let value = window["famobi"]["localStorage"]["getItem"](keyPrefix);
					return Promise.resolve({"value": value || null});
				},
				removeItem: function(keyPrefix) {
					window["famobi"]["localStorage"]["removeItem"](keyPrefix);
					return Promise.resolve({});
				},
				keys: function() {
					let keys = window["famobi"]["localStorage"]["getKeys"]();
					return Promise.resolve({"keys": keys});
				},
				clear: function() {
					window["famobi"]["localStorage"]["clear"]();
					return Promise.resolve({});
				}
			};

			// WAKOOL STORAGE
			const WAKOOL_STORAGE = {

				data: {},
				path: "/" + window.famobi_gameID + "/",

				storageType: "userStorage", // appStorage

				init: function() {
					return new Promise(resolve => {
						wakool[this.storageType].keys(this.path).then(keys => {
							keys.forEach(key => {
								wakool[this.storageType].get(this.path + key).then(result => {
									if(result) {
										this.data[key] = result;
									}
								}).catch(e => {
									resolve({err: e});
								});
							});
							resolve();
						}).catch(e => {
							resolve({err: e});
						});
					});
				},
				setItem: function(keyPrefix, value) {
					this.data[keyPrefix] = value;
					wakool[this.storageType].put(this.path + keyPrefix, JSON.stringify(value));
					return Promise.resolve({});
				},
				getItem: function(keyPrefix) {
					return Promise.resolve({"value": this.data[keyPrefix] || null});
				},
				removeItem: function(keyPrefix) {
					delete this.data[keyPrefix];
					wakool[this.storageType].remove(this.path + keyPrefix);
					return Promise.resolve({});
				},
				keys: function() {
					return Promise.resolve({"keys": Object.keys(this.data)});
				},
				clear: function() {
					this.keys().then(result => {
						result.keys.forEach(key => {
							this.removeItem(key);
						});
					});
					return Promise.resolve({});
				}
			};

			switch(storageType) {
				case 0:
					STORAGE = SESSION_STORAGE;
					break;
				case 1:
					STORAGE = LOCAL_STORAGE;
					break;
				case 2:
					STORAGE = YTGAME_STORAGE;
					break;
				case 3:
					STORAGE = GAMESNACKS_STORAGE;
					break;
				case 4:
					STORAGE = FAMOBI_STORAGE;
					break;
				case 5:
					STORAGE = WAKOOL_STORAGE;
					break;
				default:
					log && console.log("[tresor] unknown storage type. Using session/object storage as fallback.");
					storageType = 0;
					STORAGE = SESSION_STORAGE;
			}

			STORAGE.type = storageType;

			log && console.log("[tresor] selected storage: %s", STORAGES[STORAGE.type]);

			return new Promise((resolve, reject) => {
				STORAGE.init().then(() => {
					resolve();
				}).catch(e => {
					if(fallback) {
						log && console.log("[tresor] failed! using Session storage as fallback...");
						setDriver(0, false);
						STORAGE.init().then(() => {
							resolve();
						});
					} else {
						reject();
					}
				});
			});
		};

		function setItem(keyPrefix, value, callback) {
			STORAGE.setItem(keyPrefix, value).then(result => {
				if(typeof callback === "function") {
					callback(result["err"] || false, value);
				}
			});
		};

		function getItem(keyPrefix, callback) {

			if(!async) {
				return STORAGE.data[keyPrefix] || null;
			}

			STORAGE.getItem(keyPrefix).then(result => {
				if(typeof callback === "function") {
					callback(result["err"] || false, result["value"]);
				}
			});
		};

		function removeItem(keyPrefix, callback) {
			STORAGE.removeItem(keyPrefix).then(result => {
				if(typeof callback === "function") {
					callback(result["err"] || false);
				}
			});
		};

		function keys(callback) {

			if(!async) {
				return Object.keys(STORAGE.data);
			}

			STORAGE.keys().then(result => {
				if(typeof callback === "function") {
					callback(result["err"] || false, result["keys"]);
				}
			});
		};

		function clear(callback) {
			STORAGE.clear().then(result => {
				if(typeof callback === "function") {
					callback(result.keys, result.err);
				}
			});
		};

		return {
			init,
			setDriver,
			setItem,
			getItem,
			removeItem,
			keys,
			clear,
			get initialized() {
		        return initialized;
		    },
		    STORAGES
		};
	}
)();

// window["TRESOR"]["init"](3, true, false);
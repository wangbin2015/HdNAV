HDMap.UtfGridLayer = (HDMap.Layer || HDMap.Class).extend({
	includes: HDMap.Mixin.Events,
	options: {
		subdomains: 'abc',

		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,

		resolution: 4,

		useJsonP: false,
		pointerCursor: true,

		maxRequests: 4,
		requestTimeout: 60000
	},

	//The thing the mouse is currently on
	_mouseOn: null,

	initialize: function (url, options) {
		HDMap.Util.setOptions(this, options);

		// The requests
		this._requests = {};
		this._requestQueue = [];
		this._requestsInProcess = [];

		this._url = url;
		this._cache = {};

		//Find a unique id in window we can use for our callbacks
		//Required for jsonP
		var i = 0;
		while (window['lu' + i]) {
			i++;
		}
		this._windowKey = 'lu' + i;
		window[this._windowKey] = {};

		var subdomains = this.options.subdomains;
		if (typeof this.options.subdomains === 'string') {
			this.options.subdomains = subdomains.split('');
		}
	},

	onAdd: function (map) {
		this._map = map;
		this._container = this._map._container;

		this._update();

		var zoom = this._map.getZoom();

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		map.on('click', this._click, this);
		map.on('mousemove', this._move, this);
		map.on('moveend', this._update, this);
	},

	onRemove: function () {
		var map = this._map;
		map.off('click', this._click, this);
		map.off('mousemove', this._move, this);
		map.off('moveend', this._update, this);
		if (this.options.pointerCursor) {
			this._container.style.cursor = '';
		}
	},

	setUrl: function (url, noRedraw) {
		this._url = url;
		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	redraw: function () {
		// Clear cache to force all tiles to reload
		this._requestQueue = [];
		for (var reqKey in this._requests) {
			if (this._requests.hasOwnProperty(reqKey)) {
				this._abortRequest(reqKey);
			}
		}
		this._cache = {};
		this._update();
	},

	_click: function (e) {
		this.fire('click', this._objectForEvent(e));
	},
	_move: function (e) {
		var on = this._objectForEvent(e);
		if (on.data !== this._mouseOn) {
			if (this._mouseOn) {
				this.fire('mouseout', {latlng: e.latlng, data: this._mouseOn});
				if (this.options.pointerCursor) {
					this._container.style.cursor = '';
				}
			}
			if (on.data) {
				this.fire('mouseover', on);
				if (this.options.pointerCursor) {
					this._container.style.cursor = 'pointer';
				}
			}
			this._mouseOn = on.data;
		} else if (on.data) {
			this.fire('mousemove', on);
		}
	},

	_objectForEvent: function (e) {
		var map = this._map,
		    point = map.project(e.latlng),
		    tileSize = this.options.tileSize,
		    resolution = this.options.resolution,
		    x = Math.floor(point.x / tileSize),
		    y = Math.floor(point.y / tileSize),
		    gridX = Math.floor((point.x - (x * tileSize)) / resolution),
		    gridY = Math.floor((point.y - (y * tileSize)) / resolution),
			max = map.options.crs.scale(map.getZoom()) / tileSize;

		x = (x + max) % max;
		y = (y + max) % max;

		var data = this._cache[map.getZoom() + '_' + x + '_' + y];
		var result = null;
		if (data && data.grid) {
			var idx = this._utfDecode(data.grid[gridY].charCodeAt(gridX)),
				key = data.keys[idx];

			if (data.data.hasOwnProperty(key)) {
				result = data.data[key];
			}
		}

		return HDMap.extend({latlng: e.latlng, data: result}, e);
	},

	//Load up all required json grid files
	//TODO: Load from center etc
	_update: function () {

		var bounds = this._map.getPixelBounds(),
		    zoom = this._map.getZoom(),
		    tileSize = this.options.tileSize;

		if (zoom > this.options.maxZoom || zoom < this.options.minZoom) {
			return;
		}

		var nwTilePoint = new HDMap.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),
			seTilePoint = new HDMap.Point(
				Math.floor(bounds.max.x / tileSize),
				Math.floor(bounds.max.y / tileSize)),
				max = this._map.options.crs.scale(zoom) / tileSize;

		//Load all required ones
		var visibleTiles = [];
		for (var x = nwTilePoint.x; x <= seTilePoint.x; x++) {
			for (var y = nwTilePoint.y; y <= seTilePoint.y; y++) {

				var xw = (x + max) % max, yw = (y + max) % max;
				var key = zoom + '_' + xw + '_' + yw;
				visibleTiles.push(key);

				if (!this._cache.hasOwnProperty(key)) {
					this._cache[key] = null;

					if (this.options.useJsonP) {
						this._loadTileP(zoom, xw, yw);
					} else {
						this._loadTile(zoom, xw, yw);
					}
				}
			}
		}
		// If we still have requests for tiles that have now gone out of sight, attempt to abort them.
		for (var reqKey in this._requests) {
			if (visibleTiles.indexOf(reqKey) < 0) {
				this._abortRequest(reqKey);
			}
		}
	},

	_loadTileP: function (zoom, x, y) {
		var head = document.getElementsByTagName('head')[0],
		    key = zoom + '_' + x + '_' + y,
		    functionName = 'lu_' + key,
		    wk = this._windowKey,
		    self = this;

		var url = HDMap.Util.template(this._url, HDMap.Util.extend({
			s: HDMap.TileLayer.prototype._getSubdomain.call(this, {x: x, y: y}),
			z: zoom,
			x: x,
			y: y,
			cb: wk + '.' + functionName
		}, this.options));

		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);

		window[wk][functionName] = function (data) {
			self._cache[key] = data;
			delete window[wk][functionName];
			head.removeChild(script);
			self._finishRequest(key);
		};

		this._queueRequest(key, function () {
			head.appendChild(script);
			return {
				abort: function () {
					head.removeChild(script);
				}
			};
		});
	},

	_loadTile: function (zoom, x, y) {
		var url = HDMap.Util.template(this._url, HDMap.Util.extend({
			s: HDMap.TileLayer.prototype._getSubdomain.call(this, {x: x, y: y}),
			z: zoom,
			x: x,
			y: y
		}, this.options));

		var key = zoom + '_' + x + '_' + y;
		var self = this;
		this._queueRequest(key, function () {
			return HDMap.Util.ajax(url, function (data) {
				if (data !== 'error') {
					self._cache[key] = data;
				}
				self._finishRequest(key);
			});
		});
	},

	_queueRequest: function (key, callback) {
		this._requests[key] = {
			callback: callback,
			timeout: null,
			handler: null
		};
		this._requestQueue.push(key);
		this._processQueuedRequests();
	},

	_finishRequest: function (key) {
		// Remove from requests in process
		var pos = this._requestsInProcess.indexOf(key);
		if (pos >= 0) {
			this._requestsInProcess.splice(pos, 1);
		}
		// Remove from request queue
		pos = this._requestQueue.indexOf(key);
		if (pos >= 0) {
			this._requestQueue.splice(pos, 1);
		}
		// Remove the request entry
		if (this._requests[key]) {
			if (this._requests[key].timeout) {
				window.clearTimeout(this._requests[key].timeout);
			}
			delete this._requests[key];
		}
		// Recurse
		this._processQueuedRequests();
		// Fire 'load' event if all tiles have been loaded
		if (this._requestsInProcess.length === 0) {
			this.fire('load');
		}
	},

	_abortRequest: function (key) {
		// Abort the request if possible
		if (this._requests[key] && this._requests[key].handler) {
			if (typeof this._requests[key].handler.abort === 'function') {
				this._requests[key].handler.abort();
			}
		}
		// Ensure we don't keep a false copy of the data in the cache
		if (this._cache[key] === null) {
			delete this._cache[key];
		}
		// And remove the request
		this._finishRequest(key);
	},

	_processQueuedRequests: function () {
		while (this._requestQueue.length > 0 && (this.options.maxRequests === 0 ||
		       this._requestsInProcess.length < this.options.maxRequests)) {
			this._processRequest(this._requestQueue.pop());
		}
	},

	_processRequest: function (key) {
		var self = this;
		this._requests[key].timeout = window.setTimeout(function () {
			self._abortRequest(key);
		}, this.options.requestTimeout);
		this._requestsInProcess.push(key);
		// The callback might call _finishRequest, so don't assume _requests[key] still exists.
		var handler = this._requests[key].callback();
		if (this._requests[key]) {
			this._requests[key].handler = handler;
		}
	},

	_utfDecode: function (c) {
		if (c >= 93) {
			c--;
		}
		if (c >= 35) {
			c--;
		}
		return c - 32;
	}
});

HDMap.utfgridLayer = function (url, options) {
	return new HDMap.UtfGridLayer(url, options);
};

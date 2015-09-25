/*
 * HDMap.Handler.ScrollWheelZoom is used by HDMap.Map to enable mouse scroll wheel zoom on the map.
 */

HDMap.Map.mergeOptions({
	scrollWheelZoom: true,
	wheelDebounceTime: 40
});

HDMap.Map.ScrollWheelZoom = HDMap.Handler.extend({
	addHooks: function () {
		HDMap.DomEvent.on(this._map._container, {
			mousewheel: this._onWheelScroll,
			MozMousePixelScroll: HDMap.DomEvent.preventDefault
		}, this);

		this._delta = 0;
	},

	removeHooks: function () {
		HDMap.DomEvent.off(this._map._container, {
			mousewheel: this._onWheelScroll,
			MozMousePixelScroll: HDMap.DomEvent.preventDefault
		}, this);
	},

	_onWheelScroll: function (e) {
		var delta = HDMap.DomEvent.getWheelDelta(e);
		var debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(HDMap.bind(this._performZoom, this), left);

		HDMap.DomEvent.stop(e);
	},

	_performZoom: function () {
		var map = this._map,
		    delta = this._delta,
		    zoom = map.getZoom();

		map.stop(); // stop panning and fly animations if any

		delta = delta > 0 ? Math.ceil(delta) : Math.floor(delta);
		delta = Math.max(Math.min(delta, 4), -4);
		delta = map._limitZoom(zoom + delta) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(this._lastMousePos, zoom + delta);
		}
	}
});

HDMap.Map.addInitHook('addHandler', 'scrollWheelZoom', HDMap.Map.ScrollWheelZoom);

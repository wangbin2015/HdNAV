/*
 * HDMap.Handler.TouchZoom is used by HDMap.Map to add pinch zoom on supported mobile browsers.
 */

HDMap.Map.mergeOptions({
	touchZoom: HDMap.Browser.touch && !HDMap.Browser.android23,
	bounceAtZoomLimits: true
});

HDMap.Map.TouchZoom = HDMap.Handler.extend({
	addHooks: function () {
		HDMap.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		HDMap.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;

		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]),
		    viewCenter = map._getCenterLayerPoint();

		this._startCenter = p1.add(p2)._divideBy(2);
		this._startDist = p1.distanceTo(p2);

		this._moved = false;
		this._zooming = true;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		map.stop();

		HDMap.DomEvent
		    .on(document, 'touchmove', this._onTouchMove, this)
		    .on(document, 'touchend', this._onTouchEnd, this);

		HDMap.DomEvent.preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

		var map = this._map,
		    p1 = map.mouseEventToLayerPoint(e.touches[0]),
		    p2 = map.mouseEventToLayerPoint(e.touches[1]);

		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1._add(p2)._divideBy(2)._subtract(this._startCenter);

		if (!map.options.bounceAtZoomLimits) {
			var currentZoom = map.getScaleZoom(this._scale);
			if ((currentZoom <= map.getMinZoom() && this._scale < 1) ||
		     (currentZoom >= map.getMaxZoom() && this._scale > 1)) { return; }
		}

		if (!this._moved) {
			map
			    .fire('movestart')
			    .fire('zoomstart');

			this._moved = true;
		}

		HDMap.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = HDMap.Util.requestAnimFrame(this._updateOnMove, this, true, this._map._container);

		HDMap.DomEvent.preventDefault(e);
	},

	_updateOnMove: function () {
		var map = this._map;

		if (map.options.touchZoom === 'center') {
			this._center = map.getCenter();
		} else {
			this._center = map.layerPointToLatLng(this._getTargetCenter());
		}

		this._zoom = map.getScaleZoom(this._scale);

		if (this._scale !== 1 || this._delta.x !== 0 || this._delta.y !== 0) {
			map._animateZoom(this._center, this._zoom, false, true);
		}
	},

	_onTouchEnd: function () {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		HDMap.Util.cancelAnimFrame(this._animRequest);

		HDMap.DomEvent
		    .off(document, 'touchmove', this._onTouchMove)
		    .off(document, 'touchend', this._onTouchEnd);

		var map = this._map,
		    oldZoom = map.getZoom(),
		    zoomDelta = this._zoom - oldZoom,
		    finalZoom = map._limitZoom(zoomDelta > 0 ? Math.ceil(this._zoom) : Math.floor(this._zoom));

		map._animateZoom(this._center, finalZoom, true, true);
	},

	_getTargetCenter: function () {
		var centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale);
		return this._startCenter.add(centerOffset);
	}
});

HDMap.Map.addInitHook('addHandler', 'touchZoom', HDMap.Map.TouchZoom);

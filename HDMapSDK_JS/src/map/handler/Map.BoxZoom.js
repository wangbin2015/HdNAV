/*
 * HDMap.Handler.ShiftDragZoom is used to add shift-drag zoom interaction to the map
  * (zoom to a selected bounding box), enabled by default.
 */

HDMap.Map.mergeOptions({
	boxZoom: true
});

HDMap.Map.BoxZoom = HDMap.Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
	},

	addHooks: function () {
		HDMap.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		HDMap.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
	},

	moved: function () {
		return this._moved;
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

		this._moved = false;

		HDMap.DomUtil.disableTextSelection();
		HDMap.DomUtil.disableImageDrag();

		this._startPoint = this._map.mouseEventToContainerPoint(e);

		HDMap.DomEvent.on(document, {
			contextmenu: HDMap.DomEvent.stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseMove: function (e) {
		if (!this._moved) {
			this._moved = true;

			this._box = HDMap.DomUtil.create('div', 'hdmap-zoom-box', this._container);
			HDMap.DomUtil.addClass(this._container, 'hdmap-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.mouseEventToContainerPoint(e);

		var bounds = new HDMap.Bounds(this._point, this._startPoint),
		    size = bounds.getSize();

		HDMap.DomUtil.setPosition(this._box, bounds.min);

		this._box.style.width  = size.x + 'px';
		this._box.style.height = size.y + 'px';
	},

	_finish: function () {
		if (this._moved) {
			HDMap.DomUtil.remove(this._box);
			HDMap.DomUtil.removeClass(this._container, 'hdmap-crosshair');
		}

		HDMap.DomUtil.enableTextSelection();
		HDMap.DomUtil.enableImageDrag();

		HDMap.DomEvent.off(document, {
			contextmenu: HDMap.DomEvent.stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseUp: function (e) {
		if ((e.which !== 1) && (e.button !== 1)) { return; }

		this._finish();

		if (!this._moved) { return; }

		var bounds = new HDMap.LatLngBounds(
		        this._map.containerPointToLatLng(this._startPoint),
		        this._map.containerPointToLatLng(this._point));

		this._map
			.fitBounds(bounds)
			.fire('boxzoomend', {boxZoomBounds: bounds});
	},

	_onKeyDown: function (e) {
		if (e.keyCode === 27) {
			this._finish();
		}
	}
});

HDMap.Map.addInitHook('addHandler', 'boxZoom', HDMap.Map.BoxZoom);

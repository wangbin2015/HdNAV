/*
 * HDMap.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

HDMap.Map.mergeOptions({
	doubleClickZoom: true
});

HDMap.Map.DoubleClickZoom = HDMap.Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this);
	},

	_onDoubleClick: function (e) {
		var map = this._map,
		    oldZoom = map.getZoom(),
		    zoom = e.originalEvent.shiftKey ? Math.ceil(oldZoom) - 1 : Math.floor(oldZoom) + 1;

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
});

HDMap.Map.addInitHook('addHandler', 'doubleClickZoom', HDMap.Map.DoubleClickZoom);

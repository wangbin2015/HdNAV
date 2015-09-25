/*
 * HDMap.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

HDMap.Rectangle = HDMap.Polygon.extend({
	initialize: function (latLngBounds, options) {
		HDMap.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	setBounds: function (latLngBounds) {
		this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = HDMap.latLngBounds(latLngBounds);
		return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
		];
	}
});

HDMap.rectangle = function (latLngBounds, options) {
	return new HDMap.Rectangle(latLngBounds, options);
};

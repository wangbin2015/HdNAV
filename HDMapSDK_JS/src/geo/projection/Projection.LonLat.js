/*
 * Simple equirectangular (Plate Carree) projection, used by CRS like EPSG:4326 and Simple.
 */

HDMap.Projection = {};

HDMap.Projection.LonLat = {
	project: function (latlng) {
		return new HDMap.Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new HDMap.LatLng(point.y, point.x);
	},

	bounds: HDMap.bounds([-180, -90], [180, 90])
};

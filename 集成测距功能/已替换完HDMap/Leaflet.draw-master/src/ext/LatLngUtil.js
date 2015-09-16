/*
 * HDMap.LatLngUtil contains different utility functions for LatLngs.
 */

HDMap.LatLngUtil = {
	// Clones a LatLngs[], returns [][]
	cloneLatLngs: function (latlngs) {
		var clone = [];
		for (var i = 0, l = latlngs.length; i < l; i++) {
			clone.push(this.cloneLatLng(latlngs[i]));
		}
		return clone;
	},

	cloneLatLng: function (latlng) {
		return HDMap.latLng(latlng.lat, latlng.lng);
	}
};
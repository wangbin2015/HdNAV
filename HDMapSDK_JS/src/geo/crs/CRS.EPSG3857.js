/*
 * HDMap.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping and is used by Hdmap by default.
 */

HDMap.CRS.EPSG3857 = HDMap.extend({}, HDMap.CRS.Earth, {
	code: 'EPSG:3857',
	projection: HDMap.Projection.SphericalMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * HDMap.Projection.SphericalMercator.R);
		return new HDMap.Transformation(scale, 0.5, -scale, 0.5);
	}())
});

HDMap.CRS.EPSG900913 = HDMap.extend({}, HDMap.CRS.EPSG3857, {
	code: 'EPSG:900913'
});

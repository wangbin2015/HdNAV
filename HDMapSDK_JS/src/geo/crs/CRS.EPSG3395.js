/*
 * HDMap.CRS.EPSG3857 (World Mercator) CRS implementation.
 */

HDMap.CRS.EPSG3395 = HDMap.extend({}, HDMap.CRS.Earth, {
	code: 'EPSG:3395',
	projection: HDMap.Projection.Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * HDMap.Projection.Mercator.R);
		return new HDMap.Transformation(scale, 0.5, -scale, 0.5);
	}())
});

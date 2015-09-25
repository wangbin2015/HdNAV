/*
 * HDMap.CRS.EPSG4326 is a CRS popular among advanced GIS specialists.
 */

HDMap.CRS.EPSG4326 = HDMap.extend({}, HDMap.CRS.Earth, {
	code: 'EPSG:4326',
	projection: HDMap.Projection.LonLat,
	transformation: new HDMap.Transformation(1 / 180, 1, -1 / 180, 0.5)
});

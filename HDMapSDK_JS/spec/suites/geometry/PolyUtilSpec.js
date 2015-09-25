describe('PolyUtil', function () {

	describe('#clipPolygon', function () {
		it('clips polygon by bounds', function () {
			var bounds = HDMap.bounds([0, 0], [10, 10]);

			var points = [
				new HDMap.Point(5, 5),
				new HDMap.Point(15, 10),
				new HDMap.Point(10, 15)
			];

			//check clip without rounding
			var clipped = HDMap.PolyUtil.clipPolygon(points, bounds);

			for (var i = 0, len = clipped.length; i < len; i++) {
				delete clipped[i]._code;
			}

			expect(clipped).to.eql([
				new HDMap.Point(7.5, 10),
				new HDMap.Point(5, 5),
				new HDMap.Point(10, 7.5),
				new HDMap.Point(10, 10)
			]);

			//check clip with rounding
			var clippedRounded = HDMap.PolyUtil.clipPolygon(points, bounds, true);

			for (i = 0, len = clippedRounded.length; i < len; i++) {
				delete clippedRounded[i]._code;
			}

			expect(clippedRounded).to.eql([
				new HDMap.Point(8, 10),
				new HDMap.Point(5, 5),
				new HDMap.Point(10, 8),
				new HDMap.Point(10, 10)
			]);
		});
	});
});

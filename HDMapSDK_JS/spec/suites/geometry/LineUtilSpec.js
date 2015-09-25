describe('LineUtil', function () {

	describe('#clipSegment', function () {

		var bounds;

		beforeEach(function () {
			bounds = HDMap.bounds([5, 0], [15, 10]);
		});

		it('clips a segment by bounds', function () {
			var a = new HDMap.Point(0, 0);
			var b = new HDMap.Point(15, 15);

			var segment = HDMap.LineUtil.clipSegment(a, b, bounds);

			expect(segment[0]).to.eql(new HDMap.Point(5, 5));
			expect(segment[1]).to.eql(new HDMap.Point(10, 10));

			var c = new HDMap.Point(5, -5);
			var d = new HDMap.Point(20, 10);

			var segment2 = HDMap.LineUtil.clipSegment(c, d, bounds);

			expect(segment2[0]).to.eql(new HDMap.Point(10, 0));
			expect(segment2[1]).to.eql(new HDMap.Point(15, 5));
		});

		it('uses last bit code and reject segments out of bounds', function () {
			var a = new HDMap.Point(15, 15);
			var b = new HDMap.Point(25, 20);
			var segment = HDMap.LineUtil.clipSegment(a, b, bounds, true);

			expect(segment).to.be(false);
		});

		it('can round numbers in clipped bounds', function () {
			var a = new HDMap.Point(4, 5);
			var b = new HDMap.Point(8, 6);

			var segment1 = HDMap.LineUtil.clipSegment(a, b, bounds);

			expect(segment1[0]).to.eql(new HDMap.Point(5, 5.25));
			expect(segment1[1]).to.eql(b);

			var segment2 = HDMap.LineUtil.clipSegment(a, b, bounds, false, true);

			expect(segment2[0]).to.eql(new HDMap.Point(5, 5));
			expect(segment2[1]).to.eql(b);
		});
	});

	describe('#pointToSegmentDistance & #closestPointOnSegment', function () {

		var p1 = new HDMap.Point(0, 10);
		var p2 = new HDMap.Point(10, 0);
		var p = new HDMap.Point(0, 0);

		it('calculates distance from point to segment', function () {
			expect(HDMap.LineUtil.pointToSegmentDistance(p, p1, p2)).to.eql(Math.sqrt(200) / 2);
		});

		it('calculates point closest to segment', function () {
			expect(HDMap.LineUtil.closestPointOnSegment(p, p1, p2)).to.eql(new HDMap.Point(5, 5));
		});
	});

	describe('#simplify', function () {
		it('simplifies polylines according to tolerance', function () {
			var points = [
				new HDMap.Point(0, 0),
				new HDMap.Point(0.01, 0),
				new HDMap.Point(0.5, 0.01),
				new HDMap.Point(0.7, 0),
				new HDMap.Point(1, 0),
				new HDMap.Point(1.999, 0.999),
				new HDMap.Point(2, 1)
			];

			var simplified = HDMap.LineUtil.simplify(points, 0.1);

			expect(simplified).to.eql([
				new HDMap.Point(0, 0),
				new HDMap.Point(1, 0),
				new HDMap.Point(2, 1)
			]);
		});
	});

});

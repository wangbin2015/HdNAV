describe("Transformation", function () {
	var t, p;

	beforeEach(function () {
		t = new HDMap.Transformation(1, 2, 3, 4);
		p = new HDMap.Point(10, 20);
	});

	describe('#transform', function () {
		it("performs a transformation", function () {
			var p2 = t.transform(p, 2);
			expect(p2).to.eql(new HDMap.Point(24, 128));
		});
		it('assumes a scale of 1 if not specified', function () {
			var p2 = t.transform(p);
			expect(p2).to.eql(new HDMap.Point(12, 64));
		});
	});

	describe('#untransform', function () {
		it("performs a reverse transformation", function () {
			var p2 = t.transform(p, 2);
			var p3 = t.untransform(p2, 2);
			expect(p3).to.eql(p);
		});
		it('assumes a scale of 1 if not specified', function () {
			var p2 = t.transform(p);
			expect(t.untransform(new HDMap.Point(12, 64))).to.eql(new HDMap.Point(10, 20));
		});
	});
});

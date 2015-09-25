describe("Projection.Mercator", function () {
	var p = HDMap.Projection.Mercator;

	describe("#project", function () {
		it("projects a center point", function () {
			//edge cases
			expect(p.project(new HDMap.LatLng(0, 0))).near(new HDMap.Point(0, 0));
		});

		it("projects the northeast corner of the world", function () {
			expect(p.project(new HDMap.LatLng(85.0840591556, 180))).near(new HDMap.Point(20037508, 20037508));
		});

		it("projects the southwest corner of the world", function () {
			expect(p.project(new HDMap.LatLng(-85.0840591556, -180))).near(new HDMap.Point(-20037508, -20037508));
		});

		it("projects other points", function () {
			expect(p.project(new HDMap.LatLng(50, 30))).near(new HDMap.Point(3339584, 6413524));

			// from https://github.com/Hdmap/Hdmap/issues/1578
			expect(p.project(new HDMap.LatLng(51.9371170300465, 80.11230468750001)))
			        .near(new HDMap.Point(8918060.964088084, 6755099.410887127));
		});
	});

	describe("#unproject", function () {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it("unprojects a center point", function () {
			expect(pr(new HDMap.Point(0, 0))).near(new HDMap.Point(0, 0));
		});

		it("unprojects pi points", function () {
			expect(pr(new HDMap.Point(-Math.PI, Math.PI))).near(new HDMap.Point(-Math.PI, Math.PI));
			expect(pr(new HDMap.Point(-Math.PI, -Math.PI))).near(new HDMap.Point(-Math.PI, -Math.PI));

			expect(pr(new HDMap.Point(0.523598775598, 1.010683188683))).near(new HDMap.Point(0.523598775598, 1.010683188683));
		});

		it('unprojects other points', function () {
			// from https://github.com/Hdmap/Hdmap/issues/1578
			expect(pr(new HDMap.Point(8918060.964088084, 6755099.410887127)));
		});
	});
});
describe("Projection.SphericalMercator", function () {
	var p = HDMap.Projection.SphericalMercator;

	describe("#project", function () {
		it("projects a center point", function () {
			//edge cases
			expect(p.project(new HDMap.LatLng(0, 0))).near(new HDMap.Point(0, 0));
		});

		it("projects the northeast corner of the world", function () {
			expect(p.project(new HDMap.LatLng(85.0511287798, 180))).near(new HDMap.Point(20037508, 20037508));
		});

		it("projects the southwest corner of the world", function () {
			expect(p.project(new HDMap.LatLng(-85.0511287798, -180))).near(new HDMap.Point(-20037508, -20037508));
		});

		it("projects other points", function () {
			expect(p.project(new HDMap.LatLng(50, 30))).near(new HDMap.Point(3339584, 6446275));

			// from https://github.com/Hdmap/Hdmap/issues/1578
			expect(p.project(new HDMap.LatLng(51.9371170300465, 80.11230468750001)))
					.near(new HDMap.Point(8918060.96409, 6788763.38325));
		});
	});

	describe("#unproject", function () {
		function pr(point) {
			return p.project(p.unproject(point));
		}

		it("unprojects a center point", function () {
			expect(pr(new HDMap.Point(0, 0))).near(new HDMap.Point(0, 0));
		});

		it("unprojects pi points", function () {
			expect(pr(new HDMap.Point(-Math.PI, Math.PI))).near(new HDMap.Point(-Math.PI, Math.PI));
			expect(pr(new HDMap.Point(-Math.PI, -Math.PI))).near(new HDMap.Point(-Math.PI, -Math.PI));

			expect(pr(new HDMap.Point(0.523598775598, 1.010683188683))).near(new HDMap.Point(0.523598775598, 1.010683188683));
		});

		it('unprojects other points', function () {
			// from https://github.com/Hdmap/Hdmap/issues/1578
			expect(pr(new HDMap.Point(8918060.964088084, 6755099.410887127)));
		});
	});
});

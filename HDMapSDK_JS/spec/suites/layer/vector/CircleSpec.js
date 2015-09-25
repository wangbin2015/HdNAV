describe('Circle', function () {
	describe('#getBounds', function () {

		var map, circle;

		beforeEach(function () {
			map = HDMap.map(document.createElement('div')).setView([0, 0], 4);
			circle = HDMap.circle([50, 30], 200).addTo(map);
		});

		it('returns bounds', function () {
			var bounds = circle.getBounds();

			expect(bounds.getSouthWest()).nearLatLng(new HDMap.LatLng(49.94347, 29.91211));
			expect(bounds.getNorthEast()).nearLatLng(new HDMap.LatLng(50.05646, 30.08789));
		});
	});
});

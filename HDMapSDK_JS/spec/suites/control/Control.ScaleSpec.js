describe("Control.Scale", function () {
	it("can be added to an unloaded map", function () {
		var map = HDMap.map(document.createElement('div'));
		new HDMap.Control.Scale().addTo(map);
	});
});

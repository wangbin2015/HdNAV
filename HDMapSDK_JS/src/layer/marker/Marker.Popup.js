/*
 * Popup extension to HDMap.Marker, adding popup-related methods.
 */

HDMap.Marker.include({
	_getPopupAnchor: function() {
		return this.options.icon.options.popupAnchor || [0, 0];
	}
});

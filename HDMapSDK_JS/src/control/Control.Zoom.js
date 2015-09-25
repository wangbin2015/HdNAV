/*
 * HDMap.Control.Zoom is used for the default zoom buttons on the map.
 */

HDMap.Control.Zoom = HDMap.Control.extend({
	options: {
		position: 'topleft',
		zoomInText: '+',
		zoomInTitle: 'Zoom in',
		zoomOutText: '-',
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'hdmap-control-zoom',
		    container = HDMap.DomUtil.create('div', zoomName + ' hdmap-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},

	_zoomIn: function (e) {
		if (!this._disabled) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = HDMap.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		HDMap.DomEvent
		    .on(link, 'mousedown dblclick', HDMap.DomEvent.stopPropagation)
		    .on(link, 'click', HDMap.DomEvent.stop)
		    .on(link, 'click', fn, this)
		    .on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
			className = 'hdmap-disabled';

		HDMap.DomUtil.removeClass(this._zoomInButton, className);
		HDMap.DomUtil.removeClass(this._zoomOutButton, className);

		if (this._disabled || map._zoom === map.getMinZoom()) {
			HDMap.DomUtil.addClass(this._zoomOutButton, className);
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			HDMap.DomUtil.addClass(this._zoomInButton, className);
		}
	}
});

HDMap.Map.mergeOptions({
	zoomControl: true
});

HDMap.Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new HDMap.Control.Zoom();
		this.addControl(this.zoomControl);
	}
});

HDMap.control.zoom = function (options) {
	return new HDMap.Control.Zoom(options);
};

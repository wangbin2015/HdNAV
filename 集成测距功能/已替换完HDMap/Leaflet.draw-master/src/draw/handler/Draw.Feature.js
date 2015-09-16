HDMap.Draw = {};

HDMap.Draw.Feature = HDMap.Handler.extend({
	includes: HDMap.Mixin.Events,

	initialize: function (map, options) {
		this._map = map;
		this._container = map._container;
		this._overlayPane = map._panes.overlayPane;
		this._popupPane = map._panes.popupPane;

		// Merge default shapeOptions options with custom shapeOptions
		if (options && options.shapeOptions) {
			options.shapeOptions = HDMap.Util.extend({}, this.options.shapeOptions, options.shapeOptions);
		}
		HDMap.setOptions(this, options);
	},

	enable: function () {
		if (this._enabled) { return; }

		HDMap.Handler.prototype.enable.call(this);

		this.fire('enabled', { handler: this.type });

		this._map.fire('draw:drawstart', { layerType: this.type });
	},

	disable: function () {
		if (!this._enabled) { return; }

		HDMap.Handler.prototype.disable.call(this);

		this._map.fire('draw:drawstop', { layerType: this.type });

		this.fire('disabled', { handler: this.type });
	},

	addHooks: function () {
		var map = this._map;

		if (map) {
			HDMap.DomUtil.disableTextSelection();

			map.getContainer().focus();

			this._tooltip = new HDMap.Tooltip(this._map);

			HDMap.DomEvent.on(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	removeHooks: function () {
		if (this._map) {
			HDMap.DomUtil.enableTextSelection();

			this._tooltip.dispose();
			this._tooltip = null;

			HDMap.DomEvent.off(this._container, 'keyup', this._cancelDrawing, this);
		}
	},

	setOptions: function (options) {
		HDMap.setOptions(this, options);
	},

	_fireCreatedEvent: function (layer) {
		this._map.fire('draw:created', { layer: layer, layerType: this.type });
	},

	// Cancel drawing when the escape key is pressed
	_cancelDrawing: function (e) {
		if (e.keyCode === 27) {
			this.disable();
		}
	}
});
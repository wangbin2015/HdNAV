/*
 * HDMap.Control.Attribution is used for displaying attribution on the map (added by default).
 */

HDMap.Control.Attribution = HDMap.Control.extend({
	options: {
		position: 'bottomright',
		//edit by lilong 20150609
		// prefix: '<a href="http://hdnav.cn" title="A JS library for interactive maps">Hdmap</a>'
		prefix: ''
	},

	initialize: function (options) {
		HDMap.setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		this._container = HDMap.DomUtil.create('div', 'hdmap-control-attribution');
		if (HDMap.DomEvent) {
			HDMap.DomEvent.disableClickPropagation(this._container);
		}

		// TODO ugly, refactor
		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}

		this._update();

		return this._container;
	},

	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	},

	addAttribution: function (text) {
		if (!text) { return this; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	},

	removeAttribution: function (text) {
		if (!text) { return this; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' | ');
	}
});

HDMap.Map.mergeOptions({
	attributionControl: true
});

HDMap.Map.addInitHook(function () {
	if (this.options.attributionControl) {
		this.attributionControl = (new HDMap.Control.Attribution()).addTo(this);
	}
});

HDMap.control.attribution = function (options) {
	return new HDMap.Control.Attribution(options);
};

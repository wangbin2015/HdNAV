/*
 * HDMap.Control.Scale is used for displaying metric/imperial scale on the map.
 */

HDMap.Control.Scale = HDMap.Control.extend({
	options: {
		position: 'bottomleft',
		maxWidth: 100,
		metric: true,
		imperial: true
		// updateWhenIdle: false
	},

	onAdd: function (map) {
		var className = 'hdmap-control-scale',
		    container = HDMap.DomUtil.create('div', className),
		    options = this.options;

		this._addScales(options, className + '-line', container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = HDMap.DomUtil.create('div', className, container);
		}
		if (options.imperial) {
			this._iScale = HDMap.DomUtil.create('div', className, container);
		}
	},

	_update: function () {
		var map = this._map,
		    y = map.getSize().y / 2;

		var maxMeters = HDMap.CRS.Earth.distance(
				map.containerPointToLatLng([0, y]),
				map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	},

	_updateScales: function (maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters),
			//edit by lilong 20150609
		    //label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
			label = meters < 1000 ? meters + ' 米' : (meters / 1000) + ' 公里';
		this._updateScale(this._mScale, label, meters / maxMeters);
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);
			//edit by lilong 20150609
			//this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);
			this._updateScale(this._iScale, miles + ' 英里', miles / maxMiles);

		} else {
			feet = this._getRoundNum(maxFeet);
			//edit by lilong 20150609
			//this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
			this._updateScale(this._iScale, feet + ' 英尺', feet / maxFeet);
		}
	},

	_updateScale: function (scale, text, ratio) {
		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
		scale.innerHTML = text;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 :
		    d >= 5 ? 5 :
		    d >= 3 ? 3 :
		    d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});

HDMap.control.scale = function (options) {
	return new HDMap.Control.Scale(options);
};

var Knob = HDMap.Draggable.extend({
			initialize: function (element, stepHeight, knobHeight) {
				HDMap.Draggable.prototype.initialize.call(this, element, element);
				this._element = element;

				this._stepHeight = stepHeight;
				this._knobHeight = knobHeight;

				this.on('predrag', function () {
					this._newPos.x = 0;
					this._newPos.y = this._adjust(this._newPos.y);
				}, this);
			},

			_adjust: function (y) {
				var value = Math.round(this._toValue(y));
				value = Math.max(0, Math.min(this._maxValue, value));
				return this._toY(value);
			},

			// y = k*v + m
			_toY: function (value) {
				return this._k * value + this._m;
			},
			// v = (y - m) / k
			_toValue: function (y) {
				return (y - this._m) / this._k;
			},

			setSteps: function (steps) {
				var sliderHeight = steps * this._stepHeight;
				this._maxValue = steps - 1;

				// conversion parameters
				// the conversion is just a common linear function.
				this._k = -this._stepHeight;
				this._m = sliderHeight - (this._stepHeight + this._knobHeight) / 2;
			},

			setPosition: function (y) {
				HDMap.DomUtil.setPosition(this._element,
									  HDMap.point(0, this._adjust(y)));
			},

			setValue: function (v) {
				this.setPosition(this._toY(v));
			},

			getValue: function () {
				return this._toValue(HDMap.DomUtil.getPosition(this._element).y);
			}
		});

HDMap.Control.Zoomslider = HDMap.Control.extend({
			options: {
				position: 'topleft',
				// Height of zoom-slider.png in px
				stepHeight: 8,
				// Height of the knob div in px (including border)
				knobHeight: 6,
				styleNS: 'hdmap-control-zoomslider'
			},

			onAdd: function (map) {
				this._map = map;
				this._ui = this._createUI();
				this._knob = new Knob(this._ui.knob,
									  this.options.stepHeight,
									  this.options.knobHeight);

				map.whenReady(this._initKnob,        this)
					.whenReady(this._initEvents,      this)
					.whenReady(this._updateSize,      this)
					.whenReady(this._updateKnobValue, this)
					.whenReady(this._updateDisabled,  this);
				return this._ui.bar;
			},

			onRemove: function (map) {
				map.off('zoomlevelschange',         this._updateSize,      this)
					.off('zoomend zoomlevelschange', this._updateKnobValue, this)
					.off('zoomend zoomlevelschange', this._updateDisabled,  this);
			},

			_createUI: function () {
				var ui = {},
					ns = this.options.styleNS;

				ui.bar     = HDMap.DomUtil.create('div', ns + ' hdmap-bar');
				ui.zoomIn  = this._createZoomBtn('in', 'top', ui.bar);
				ui.wrap    = HDMap.DomUtil.create('div', ns + '-wrap hdmap-bar-part', ui.bar);
				ui.zoomOut = this._createZoomBtn('out', 'bottom', ui.bar);
				ui.body    = HDMap.DomUtil.create('div', ns + '-body', ui.wrap);
				ui.knob    = HDMap.DomUtil.create('div', ns + '-knob');

				HDMap.DomEvent.disableClickPropagation(ui.bar);
				HDMap.DomEvent.disableClickPropagation(ui.knob);

				return ui;
			},
			_createZoomBtn: function (zoomDir, end, container) {
				var classDef = this.options.styleNS + '-' + zoomDir +
						' hdmap-bar-part' +
						' hdmap-bar-part-' + end,
					link = HDMap.DomUtil.create('a', classDef, container);

				link.href = '#';
				link.title = 'Zoom ' + zoomDir;

				HDMap.DomEvent.on(link, 'click', HDMap.DomEvent.preventDefault);

				return link;
			},

			_initKnob: function () {
				this._knob.enable();
				this._ui.body.appendChild(this._ui.knob);
			},
			_initEvents: function () {
				this._map
					.on('zoomlevelschange',         this._updateSize,      this)
					.on('zoomend zoomlevelschange', this._updateKnobValue, this)
					.on('zoomend zoomlevelschange', this._updateDisabled,  this);

				HDMap.DomEvent.on(this._ui.body,    'click', this._onSliderClick, this);
				HDMap.DomEvent.on(this._ui.zoomIn,  'click', this._zoomIn,        this);
				HDMap.DomEvent.on(this._ui.zoomOut, 'click', this._zoomOut,       this);

				this._knob.on('dragend', this._updateMapZoom, this);
			},

			_onSliderClick: function (e) {
				var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
					y = HDMap.DomEvent.getMousePosition(first, this._ui.body).y;

				this._knob.setPosition(y);
				this._updateMapZoom();
			},

			_zoomIn: function (e) {
				this._map.zoomIn(e.shiftKey ? 3 : 1);
			},
			_zoomOut: function (e) {
				this._map.zoomOut(e.shiftKey ? 3 : 1);
			},

			_zoomLevels: function () {
				var zoomLevels = this._map.getMaxZoom() - this._map.getMinZoom() + 1;
				return zoomLevels < Infinity ? zoomLevels : 0;
			},
			_toZoomLevel: function (value) {
				return value + this._map.getMinZoom();
			},
			_toValue: function (zoomLevel) {
				return zoomLevel - this._map.getMinZoom();
			},

			_updateSize: function () {
				var steps = this._zoomLevels();

				this._ui.body.style.height = this.options.stepHeight * steps + 'px';
				this._knob.setSteps(steps);
			},
			_updateMapZoom: function () {
				this._map.setZoom(this._toZoomLevel(this._knob.getValue()));
			},
			_updateKnobValue: function () {
				this._knob.setValue(this._toValue(this._map.getZoom()));
			},
			_updateDisabled: function () {
				var zoomLevel = this._map.getZoom(),
					className = this.options.styleNS + '-disabled';

				HDMap.DomUtil.removeClass(this._ui.zoomIn,  className);
				HDMap.DomUtil.removeClass(this._ui.zoomOut, className);

				if (zoomLevel === this._map.getMinZoom()) {
					HDMap.DomUtil.addClass(this._ui.zoomOut, className);
				}
				if (zoomLevel === this._map.getMaxZoom()) {
					HDMap.DomUtil.addClass(this._ui.zoomIn, className);
				}
			}
		});

HDMap.Map.addInitHook(function () {
		if (this.options.zoomsliderControl) {
			this.zoomsliderControl = new HDMap.Control.Zoomslider();
			this.addControl(this.zoomsliderControl);
		}
	});

HDMap.Map.mergeOptions({
	zoomControl: false,
	zoomsliderControl: true
});

HDMap.control.zoomslider = function (options) {
		return new HDMap.Control.Zoomslider(options);
	};

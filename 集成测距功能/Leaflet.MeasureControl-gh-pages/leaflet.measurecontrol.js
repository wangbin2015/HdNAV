HDMap.Polyline.Measure = HDMap.Draw.Polyline.extend({
    addHooks: function() {
        HDMap.Draw.Polyline.prototype.addHooks.call(this);
        if (this._map) {
            this._markerGroup = new HDMap.LayerGroup();
            this._map.addLayer(this._markerGroup);

            this._markers = [];
            this._map.on('click', this._onClick, this);
            this._startShape();
        }
    },

    removeHooks: function () {
        HDMap.Draw.Polyline.prototype.removeHooks.call(this);

        this._clearHideErrorTimeout();

        //!\ Still useful when control is disabled before any drawing (refactor needed?)
        this._map.off('mousemove', this._onMouseMove);
        this._clearGuides();
        this._container.style.cursor = '';

        this._removeShape();

        this._map.off('click', this._onClick, this);
    },

    _startShape: function() {
        this._drawing = true;
        this._poly = new HDMap.Polyline([], this.options.shapeOptions);

        this._container.style.cursor = 'crosshair';

        this._updateTooltip();
        this._map.on('mousemove', this._onMouseMove, this);
    },

    _finishShape: function () {
        this._drawing = false;

        this._cleanUpShape();
        this._clearGuides();

        this._updateTooltip();

        this._map.off('mousemove', this._onMouseMove, this);
        this._container.style.cursor = '';
    },

    _removeShape: function() {
        if (!this._poly)
            return;
        this._map.removeLayer(this._poly);
        delete this._poly;
        this._markers.splice(0);
        this._markerGroup.clearLayers();
    },

    _onClick: function(e) {
        if (!this._drawing) {
            this._removeShape();
            this._startShape();
            return;
        }
    },

    _getTooltipText: function() {
        var labelText = HDMap.Draw.Polyline.prototype._getTooltipText.call(this);
        if (!this._drawing) {
            labelText.text = '';
        }
        return labelText;
    }
});

HDMap.Control.MeasureControl = HDMap.Control.extend({

    statics: {
        TITLE: 'Measure distances'
    },
    options: {
        position: 'topleft',
        handler: {}
    },

    toggle: function() {
        if (this.handler.enabled()) {
            this.handler.disable.call(this.handler);
        } else {
            this.handler.enable.call(this.handler);
        }
    },

    onAdd: function(map) {
        var className = 'leaflet-control-draw';

        this._container = HDMap.DomUtil.create('div', 'leaflet-bar');

        this.handler = new HDMap.Polyline.Measure(map, this.options.handler);

        this.handler.on('enabled', function () {
            HDMap.DomUtil.addClass(this._container, 'enabled');
        }, this);

        this.handler.on('disabled', function () {
            HDMap.DomUtil.removeClass(this._container, 'enabled');
        }, this);

        var link = HDMap.DomUtil.create('a', className+'-measure', this._container);
        link.href = '#';
        link.title = HDMap.Control.MeasureControl.TITLE;

        HDMap.DomEvent
            .addListener(link, 'click', HDMap.DomEvent.stopPropagation)
            .addListener(link, 'click', HDMap.DomEvent.preventDefault)
            .addListener(link, 'click', this.toggle, this);

        return this._container;
    }
});


HDMap.Map.mergeOptions({
    measureControl: false
});


HDMap.Map.addInitHook(function () {
    if (this.options.measureControl) {
        this.measureControl = HDMap.Control.measureControl().addTo(this);
    }
});


HDMap.Control.measureControl = function (options) {
    return new HDMap.Control.MeasureControl(options);
};


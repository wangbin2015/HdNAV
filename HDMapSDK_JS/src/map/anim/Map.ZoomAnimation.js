/*
 * Extends HDMap.Map to handle zoom animations.
 */

HDMap.Map.mergeOptions({
	zoomAnimation: true,
	zoomAnimationThreshold: 4
});

var zoomAnimated = HDMap.DomUtil.TRANSITION && HDMap.Browser.any3d && !HDMap.Browser.mobileOpera;

if (zoomAnimated) {

	HDMap.Map.addInitHook(function () {
		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
		this._zoomAnimated = this.options.zoomAnimation;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {

			this._createAnimProxy();

			HDMap.DomEvent.on(this._proxy, HDMap.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
		}
	});
}

HDMap.Map.include(!zoomAnimated ? {} : {

	_createAnimProxy: function () {

		var proxy = this._proxy = HDMap.DomUtil.create('div', 'hdmap-proxy hdmap-zoom-animated');
		this._panes.mapPane.appendChild(proxy);

		this.on('zoomanim', function (e) {
			var prop = HDMap.DomUtil.TRANSFORM,
				transform = proxy.style[prop];

			HDMap.DomUtil.setTransform(proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

			// workaround for case when transform is the same and so transitionend event is not fired
			if (transform === proxy.style[prop] && this._animatingZoom) {
				this._onZoomTransitionEnd();
			}
		}, this);

		this.on('load moveend', function () {
			var c = this.getCenter(),
				z = this.getZoom();
			HDMap.DomUtil.setTransform(proxy, this.project(c, z), this.getZoomScale(z, 1));
		}, this);
	},

	_catchTransitionEnd: function (e) {
		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
			this._onZoomTransitionEnd();
		}
	},

	_nothingToAnimate: function () {
		return !this._container.getElementsByClassName('hdmap-zoom-animated').length;
	},

	_tryAnimatedZoom: function (center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options = options || {};

		// don't animate if disabled, not supported or zoom difference is too large
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		HDMap.Util.requestAnimFrame(function () {
			this
			    .fire('movestart')
			    .fire('zoomstart')
			    ._animateZoom(center, zoom, true);
		}, this);

		return true;
	},

	_animateZoom: function (center, zoom, startAnim, noUpdate) {
		if (startAnim) {
			this._animatingZoom = true;

			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;

			HDMap.DomUtil.addClass(this._mapPane, 'hdmap-zoom-anim');
		}

		this.fire('zoomanim', {
			center: center,
			zoom: zoom,
			scale: this.getZoomScale(zoom),
			origin: this.latLngToLayerPoint(center),
			offset: this._getCenterOffset(center).multiplyBy(-1),
			noUpdate: noUpdate
		});
	},

	_onZoomTransitionEnd: function () {

		this._animatingZoom = false;

		HDMap.DomUtil.removeClass(this._mapPane, 'hdmap-zoom-anim');

		this._resetView(this._animateToCenter, this._animateToZoom, true, true);
	}
});

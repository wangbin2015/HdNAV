/*
 * HDMap.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

HDMap.Draggable = HDMap.Evented.extend({

	statics: {
		START: HDMap.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			pointerdown: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			pointerdown: 'touchmove',
			MSPointerDown: 'touchmove'
		}
	},

	initialize: function (element, dragStartTarget, preventOutline) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
		this._preventOutline = preventOutline;
	},

	enable: function () {
		if (this._enabled) { return; }

		HDMap.DomEvent.on(this._dragStartTarget, HDMap.Draggable.START.join(' '), this._onDown, this);

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		HDMap.DomEvent.off(this._dragStartTarget, HDMap.Draggable.START.join(' '), this._onDown, this);

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		this._moved = false;

		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		HDMap.DomEvent.stopPropagation(e);

		if (this._preventOutline) {
			HDMap.DomUtil.preventOutline(this._element);
		}

		if (HDMap.DomUtil.hasClass(this._element, 'hdmap-zoom-anim')) { return; }

		HDMap.DomUtil.disableImageDrag();
		HDMap.DomUtil.disableTextSelection();

		if (this._moving) { return; }

		this.fire('down');

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new HDMap.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = HDMap.DomUtil.getPosition(this._element);

		HDMap.DomEvent
		    .on(document, HDMap.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, HDMap.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new HDMap.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (HDMap.Browser.touch && Math.abs(offset.x) + Math.abs(offset.y) < 3) { return; }

		HDMap.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = HDMap.DomUtil.getPosition(this._element).subtract(offset);

			HDMap.DomUtil.addClass(document.body, 'hdmap-dragging');

			this._lastTarget = e.target || e.srcElement;
			HDMap.DomUtil.addClass(this._lastTarget, 'hdmap-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		HDMap.Util.cancelAnimFrame(this._animRequest);
		this._lastEvent = e;
		this._animRequest = HDMap.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		var e = {originalEvent: this._lastEvent};
		this.fire('predrag', e);
		HDMap.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag', e);
	},

	_onUp: function () {
		HDMap.DomUtil.removeClass(document.body, 'hdmap-dragging');

		if (this._lastTarget) {
			HDMap.DomUtil.removeClass(this._lastTarget, 'hdmap-drag-target');
			this._lastTarget = null;
		}

		for (var i in HDMap.Draggable.MOVE) {
			HDMap.DomEvent
			    .off(document, HDMap.Draggable.MOVE[i], this._onMove, this)
			    .off(document, HDMap.Draggable.END[i], this._onUp, this);
		}

		HDMap.DomUtil.enableImageDrag();
		HDMap.DomUtil.enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			HDMap.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
	}
});

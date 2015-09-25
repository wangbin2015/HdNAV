/*
 * HDMap.Icon.Default is the blue marker icon used by default in Hdmap.
 */

HDMap.Icon.Default = HDMap.Icon.extend({

	options: {
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		var path = HDMap.Icon.Default.imagePath;

		if (!path) {
			throw new Error('Couldn\'t autodetect HDMap.Icon.Default.imagePath, set it manually.');
		}

		return path + '/marker-' + name + (HDMap.Browser.retina && name === 'icon' ? '-2x' : '') + '.png';
	}
});

HDMap.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
	    hdmapRe = /[\/^]hdmap[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, path;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;

		if (src.match(hdmapRe)) {
			path = src.split(hdmapRe)[0];
			return (path ? path + '/' : '') + 'images';
		}
	}
}());


var HDMap = {
	version: '1.0-dev'
};

function expose() {
	var oldL = window.HDMap;

	HDMap.noConflict = function () {
		window.HDMap = oldL;
		return this;
	};

	window.HDMap = HDMap;
}

// define Hdmap for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = HDMap;

// define Hdmap as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(HDMap);
}

// define Hdmap as a global HDMap variable, saving the original HDMap to restore later if needed
if (typeof window !== 'undefined') {
	expose();
}

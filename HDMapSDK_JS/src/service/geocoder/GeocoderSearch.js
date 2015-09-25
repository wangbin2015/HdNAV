/**
 * Created by suntao on 2015/8/27.
 */
HDMap.GeocoderSearch = HDMap.Class.extend({
    options: {},

    initialize: function (options) {
        if (typeof options === 'object' && options instanceof HDMap.GeocoderSearchOptions) {
            options = HDMap.setOptions(this, options);
            this._request = {};
        } else {
            throw new Error('Invalid GeocoderSearchOptions object');
        }
    },

    geoEncode: function(address, region) {
        if (typeof address === 'string' && typeof region === 'number') {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/geocoder?{address}&{region}';
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                address: address,
                region: region
            }));
            //查找当前请求是否在请求队列中
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._address = address;
            this._region = region;
            //添加到请求列表中
            this._request[infoRequestUrl] = 'geoEncode';
            this._searchType = 'geoEncode';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //从请求队列中删除消息
                delete self._request[infoRequestUrl];
                //处理搜索结果
                if (data !== 'error') {
                    self._result = HDMap.geocoderResult(true, data);
                } else {
                    self._result = HDMap.geocoderResult(true, {status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    geoDecode: function(location) {
        if (location instanceof HDMap.LatLng) {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/geocoder?{location}';
            var latLonStr = [location.lat, location.lng].join(',');
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                location: latLonStr
            }));
            //查找当前请求是否在请求队列中
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._location = location;
            //添加到请求列表中
            this._request[infoRequestUrl] = 'geoDecode';
            this._searchType = 'geoDecode';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //从请求队列中删除消息
                delete self._request[infoRequestUrl];
                //处理搜索结果
                if (data !== 'error') {
                    self._result = HDMap.geocoderResult(false, data);
                } else {
                    self._result = HDMap.geocoderResult(false, {status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    }
});

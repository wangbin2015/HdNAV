/**
 * Created by suntao on 2015/8/26.
 */
HDMap.DistrictSearch = HDMap.Class.extend({
    options: {},

    initialize: function (options) {
        if (typeof options === 'object' && options instanceof HDMap.DistrictSearchOptions) {
            options = HDMap.setOptions(this, options);
            this._request = {};
        } else {
            throw new Error('Invalid DistrictSearchOptions object');
        }
    },

    searchByLocation: function(location) {
        if (location instanceof HDMap.LatLng) {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/district?{location}';
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
            this._request[infoRequestUrl] = 'searchByLocation';
            this._searchType = 'searchByLocation';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //从请求队列中删除消息
                delete self._request[infoRequestUrl];
                //处理搜索结果
                if (data !== 'error') {
                    self._result = HDMap.districtResult(data);
                } else {
                    self._result = HDMap.districtResult({status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    searchByRegion: function(region) {
        if (typeof region === 'number') {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/district?{region}';
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                region: region
            }));
            //查找当前请求是否在请求队列中
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._region = region;
            //添加到请求列表中
            this._request[infoRequestUrl] = 'searchByRegion';
            this._searchType = 'searchByRegion';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //从请求队列中删除消息
                delete self._request[infoRequestUrl];
                //处理搜索结果
                if (data !== 'error') {
                    self._result = HDMap.districtResult(data);
                } else {
                    self._result = HDMap.districtResult({status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    searchByName: function(distname) {
        if (typeof distname === 'string') {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/district?{districtname}';
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                districtname: distname
            }));
            //查找当前请求是否在请求队列中
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._districtname = distname;
            //添加到请求列表中
            this._request[infoRequestUrl] = 'searchByName';
            this._searchType = 'searchByName';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //从请求队列中删除消息
                delete self._request[infoRequestUrl];
                //处理搜索结果
                if (data !== 'error') {
                    self._result = HDMap.districtResult(data);
                } else {
                    self._result = HDMap.districtResult({status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    }
});

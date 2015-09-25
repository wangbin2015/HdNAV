/**
 * Created by CHENWENBIN on 2015/8/21.
 */
HDMap.LocalSearch = HDMap.Class.extend({
    options: {},
    _searchOptions : {},
    initialize: function (options) {
        if (typeof options === 'object' && options instanceof HDMap.LocalSearchOptions) {
            options = HDMap.setOptions(this, options);
            this._request = {};
        } else {
            throw new Error('Invalid LocalSearchOptions object');
        }
    },

    searchInCity: function(options, region, type) {
        this._type = type;
        if (type === 1) {
            return this._searchInSea(options, region);
        } else {
            return this._searchInLand(options, region);
        }
    },

    searchInBounds: function (options, bounds, type) {
        if (typeof options === 'object' && options instanceof HDMap.LocalSearchSetting &&
            typeof bounds === 'object' && bounds instanceof  HDMap.LatLngBounds) {
            var baseUrl = this.options.url + 'v1/poi?{query}&page_{size}&page_{num}&{bounds}&{type}';
            var boundsStr = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()].join(',');
            var requestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                query: options.keyword,
                size: options.pageSize,
                num: options.pageIndex,
                bounds: boundsStr,
                type: type
            }));
            //查找当前请求是否在请求队列中
            if (this._request[requestUrl]) {
                return true;
            }
            this._searchOptions = options;
            this._bounds = bounds;
            this._type = type;
            //添加到请求列表中
            this._request[requestUrl] = 'searchInBounds';
            this._searchType = 'searchInBounds';
            var self = this;
            HDMap.Util.ajax(encodeURI(requestUrl), function (data) {
                //删除
                delete self._request[requestUrl];
                //处理检索结果
                if (data !== 'error') {
                    self._result = HDMap.localReslut(false, options, data);
                } else {
                    self._result = HDMap.localReslut(false, options, {status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    searchNearby: function (options, center, radius, type) {
        if (typeof center === 'object' && center instanceof HDMap.LatLng &&
            typeof radius === 'number' && typeof options === 'object' && options instanceof HDMap.LocalSearchSetting) {
            var baseUrl = this.options.url + 'v1/poi?{query}&page_{size}&page_{num}&{location}&{radius}&{type}';
            var locationStr = [center.lat, center.lng].join(',');
            var requestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                query: options.keyword,
                size: options.pageSize,
                num: options.pageIndex,
                location: locationStr,
                radius : radius,
                type: type
            }));
            //查找当前请求是否在请求队列中
            if (this._request[requestUrl]) {
                return true;
            }
            this._searchOptions = options;
            this._center = center;
            this._radius = radius;
            this._type = type;
            //添加到请求列表中
            this._request[requestUrl] = 'searchNearby';
            this._searchType = 'searchNearby';
            var self = this;
            HDMap.Util.ajax(encodeURI(requestUrl), function (data) {
                //删除
                delete self._request[requestUrl];
                //处理检索结果
                if (data !== 'error') {
                    self._result = HDMap.localReslut(false, options, data);
                } else {
                    self._result = HDMap.localReslut(false, options, {status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    _processDistrictName : function (url, nameRequestUrl, options, districtData) {
        //判断是否城市一级的行政区划编码
        var regionCode = '';
        var isProvince = false;
        for (var i in districtData.results) {
            if (districtData.results[i].length === 3) {
                //市级行政区划
                regionCode = districtData.results[i][2].district_code;
            } else if (districtData.results[i].length === 2) {
                //省份或者直辖市
                var districtName = districtData.results[i][1].district_name;
                if (districtName.indexOf('北京') >= 0 ||
                    districtName.indexOf('上海') >= 0 ||
                    districtName.indexOf('天津') >= 0 ||
                    districtName.indexOf('重庆') >= 0) {
                    isProvince = false;
                } else {
                    isProvince = true;
                }
                regionCode = districtData.results[i][1].district_code;
            } else {
                continue;
            }
            //检索到省或者市就直接退出
            break;
        }
        //由于参数是行政区划编码，重新生成请求URL
        var codeRequestUrl = HDMap.Util.serviceUrlTemplate(url, HDMap.Util.extend({
            query: options.keyword,
            size: options.pageSize,
            num: options.pageIndex,
            region: regionCode
        }));
        var self = this;
        HDMap.Util.ajax(encodeURI(codeRequestUrl), function (data) {
            //使用城市名称的URL进行删除
            delete self._request[nameRequestUrl];
            //处理检索结果
            if (data !== 'error') {
                self._result = HDMap.localReslut(isProvince, options, data);
            } else {
                self._result = HDMap.localReslut(isProvince, options, {status : -1, message : 'Network Error'});
            }
            self.options.onSearchComplete(self._result);
        });
    },

    _searchInSea : function (options, region) {
        if (typeof options === 'object' && options instanceof HDMap.LocalSearchSetting) {
            if (region !== '全国' && region !== '中华人民共和国' && region !== '中国') {
                this._result = HDMap.localReslut(false, options, {status : -1, message : 'Parameter Error'});
                this.options.onSearchComplete(this._result);
                return true;
            }
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/poi?{query}&page_{size}&page_{num}&{region}&{type}';
            var requestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                query: options.keyword,
                size: options.pageSize,
                num: options.pageIndex,
                region: 0,
                type : 1
            }));
            //查找当前请求是否在请求队列中
            if (this._request[requestUrl]) {
                return true;
            }
            this._searchOptions = options;
            this._region = region;
            //添加到请求列表中
            this._request[requestUrl] = 'searchInCity';
            this._searchType = 'searchInCity';
            //检索海图POI
            var self = this;
            HDMap.Util.ajax(encodeURI(requestUrl), function (data) {
                delete self._request[requestUrl];
                //处理检索结果
                if (data !== 'error') {
                    self._result = HDMap.localReslut(false, options, data);
                } else {
                    self._result = HDMap.localReslut(false, options, {status : -1, message : 'Network Error'});
                }
                self.options.onSearchComplete(self._result);
            });
            return true;
        } else {
            return false;
        }
    },

    _searchInLand : function(options, region) {
        if (typeof options === 'object' && options instanceof HDMap.LocalSearchSetting && typeof region === 'string') {
            //由于编码规范要求，不能命名变量为page_size形式，所以只对_以后的变量进行处理
            var baseUrl = this.options.url + 'v1/poi?{query}&page_{size}&page_{num}&{region}';
            var nameRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                query: options.keyword,
                size: options.pageSize,
                num: options.pageIndex,
                region: region,
                type : 0
            }));
            //查找当前请求是否在请求队列中
            if (this._request[nameRequestUrl]) {
                return true;
            }
            this._searchOptions = options;
            this._region = region;
            //添加到请求列表中
            this._request[nameRequestUrl] = 'searchInCity';
            this._searchType = 'searchInCity';
            //先请求行政区划编码
            var districtUrl = this.options.url + 'v1/district?{districtname}';
            var districtRequestUrl = HDMap.Util.serviceUrlTemplate(districtUrl, HDMap.Util.extend({districtname : region}));
            var self = this;
            HDMap.Util.ajax(encodeURI(districtRequestUrl), function (data) {
                //解析处理行政区划编码
                if (data !== 'error') {
                    self._processDistrictName(baseUrl, nameRequestUrl, options, data);
                } else {
                    delete self._request[nameRequestUrl];
                    self._result = HDMap.localReslut(false, options, {status : -1, message : 'Network Error'});
                    self.options.onSearchComplete(self._result);
                }
            });
            return true;
        } else {
            return false;
        }
    },

    getResults : function () {
        return this._result;
    },

    clearResults : function () {
        delete this._result;
    },

    setSearchCompleteCallback : function (callback) {
        this.options.onSearchComplete = callback;
    },

    gotoPage : function(pageIndex) {
        if (this._result === undefined) {
            return;
        }
        this._searchOptions.pageIndex = pageIndex;
        if (this._searchOptions.pageIndex >= this._result.getTotalPageNum())
        {
            return;
        }
        switch (this._searchType) {
            case 'searchInCity':
                this.searchInCity(this._searchOptions, this._region, this._type);
                break;
            case 'searchInBounds':
                this.searchInBounds(this._searchOptions, this._bounds, this._type);
                break;
            case 'searchNearby':
                this.searchNearby(this._searchOptions, this._center, this._radius, this._type);
                break;
            default :
                break;
        }
    }
});

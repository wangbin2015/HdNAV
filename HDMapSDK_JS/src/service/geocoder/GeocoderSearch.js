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
            //���ڱ���淶Ҫ�󣬲�����������Ϊpage_size��ʽ������ֻ��_�Ժ�ı������д���
            var baseUrl = this.options.url + 'v1/geocoder?{address}&{region}';
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                address: address,
                region: region
            }));
            //���ҵ�ǰ�����Ƿ������������
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._address = address;
            this._region = region;
            //��ӵ������б���
            this._request[infoRequestUrl] = 'geoEncode';
            this._searchType = 'geoEncode';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //�����������ɾ����Ϣ
                delete self._request[infoRequestUrl];
                //�����������
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
            //���ڱ���淶Ҫ�󣬲�����������Ϊpage_size��ʽ������ֻ��_�Ժ�ı������д���
            var baseUrl = this.options.url + 'v1/geocoder?{location}';
            var latLonStr = [location.lat, location.lng].join(',');
            var infoRequestUrl = HDMap.Util.serviceUrlTemplate(baseUrl, HDMap.Util.extend({
                location: latLonStr
            }));
            //���ҵ�ǰ�����Ƿ������������
            if (this._request[infoRequestUrl]) {
                return true;
            }
            this._location = location;
            //��ӵ������б���
            this._request[infoRequestUrl] = 'geoDecode';
            this._searchType = 'geoDecode';
            var self = this;
            HDMap.Util.ajax(encodeURI(infoRequestUrl), function (data) {
                //�����������ɾ����Ϣ
                delete self._request[infoRequestUrl];
                //�����������
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

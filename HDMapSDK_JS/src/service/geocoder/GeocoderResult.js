/**
 * Created by suntao on 2015/8/27.
 */
HDMap.GeocoderEncodeInfo = function(addrname, location) {
    this.addrname = addrname;
    this.location = location;
};

HDMap.GeocoderDecodeInfo = function(address, location, telephone, districtCode, poiName) {
    this.address = address;
    this.location = location;
    this.telephone = telephone;
    this.districtCode = districtCode;
    this.poiName = poiName;
};

HDMap.GeocoderResult = function(isEncode, data) {
    this.status = data.status;
    this.message = data.message;
    this._infolist = [];

    if (this.status === 0) {
        if (data.results instanceof Array) {
            if (isEncode) {
                for (var i in data.results) {
                    this._infolist.push(new HDMap.GeocoderEncodeInfo(data.results[i].fulladdrname, data.results[i].location));
                }
            } else {
                for (var j in data.results) {
                    this._infolist.push(new HDMap.GeocoderDecodeInfo(data.results[j].address, data.results[j].location,
                        data.results[j].telephone, data.results[j].district_code, data.results[j].poi_name));
                }
            }
        }
    }
};

HDMap.GeocoderResult.prototype = {
    getStatus : function () {
        return this.status;
    },

    getMessage : function () {
        return this.message;
    },

    getInfoList: function() {
        return this._infolist;
    }
};

HDMap.geocoderResult = function(isEncode, data) {
    return new HDMap.GeocoderResult(isEncode, data);
};

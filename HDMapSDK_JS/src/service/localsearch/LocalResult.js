/**
 * Created by CHENWENBIN on 2015/8/25.
 */
HDMap.LocalResultPoi = function(name, point, address, telephone, id, type, detailInfo) {
    this.name = name;
    this.point = point;
    this.address = address;
    this.telephone = telephone;
    this.uId = id;
    this.poiType = type;
    this.detailInfo = detailInfo;
};

HDMap.LocalResultCity = function(cityName, poiNum) {
    this.cityName = cityName;
    this.poiNum = poiNum;
};

HDMap.LocalResult = function(isProvince, queryOptions, data) {
    this._status = data.status;
    this._message = data.message;
    this._total = data.total;
    this._poiList = [];
    this._cityList = [];
    this._queryOptions = queryOptions;
    var i = 0;
    if (isProvince) {
        //省份
        for (i in data.results) {
            this._cityList.push(new HDMap.LocalResultCity(data.results[i].name, data.results[i].num));
        }
    } else {
        //城市
        for (i in data.results) {
            this._poiList.push(new HDMap.LocalResultPoi(
                data.results[i].name,
                HDMap.latLng(data.results[i].location.lat, data.results[i].location.lon),
                data.results[i].address,
                data.results[i].telephone,
                data.results[i].uid,
                data.results[i].poitype,
                data.results[i].detail_info
            ));
        }
    }
};

HDMap.LocalResult.prototype = {
    getPoiList : function () {
        return this._poiList;
    },

    getCityList : function () {
        return this._cityList;
    },

    getTotalPoiNum : function () {
        return this._total;
    },

    getCurrentPageIndex : function () {
        return this._queryOptions.pageIndex;
    },

    getPageSize : function () {
        return this._queryOptions.pageSize;
    },

    getTotalPageNum : function () {
        if (this._queryOptions.pageSize > 0) {
            return  Math.ceil(this._total / this._queryOptions.pageSize);
        } else {
            return 1;
        }
    }
};

HDMap.localReslut = function(isProvince, queryOptions, data) {
    return new HDMap.LocalResult(isProvince, queryOptions, data);
};

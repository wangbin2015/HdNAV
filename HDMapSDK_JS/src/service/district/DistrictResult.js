/**
 * Created by suntao on 2015/8/26.
 */
HDMap.DistrictResultInfo = function(districtname, districtcode, districtclass) {
    this.districtname = districtname;
    this.districtcode = districtcode;
    this.districtclass = districtclass;
};

HDMap.DistrictResult = function(data) {
    this.status = data.status;
    this.message = data.message;
    this._infolist = [];

    if (this.status === 0) {
        if (data.results instanceof Array) {
            //获取行政区划信息
            for (var i in data.results) {
                if (data.results[i] instanceof Array) {
                    //根据名称获取行政区划编码信息
                    var tempList = [];
                    for (var j in data.results[i]) {
                        tempList.push(new HDMap.DistrictResultInfo(data.results[i][j].district_name, data.results[i][j].district_code, data.results[i][j].district_class));
                    }
                    this._infolist.push(tempList);
                } else {
                    //根据地理位置获取行政区划信息
                    this._infolist.push(new HDMap.DistrictResultInfo(data.results[i].district_name, data.results[i].district_code, data.results[i].district_class));
                }
            }
        } else {
            //获取行政区划地理范围
            for (var i1 in data.results.geometry.coordinates) {
                if (data.results.geometry.coordinates[i1] instanceof Array) {
                    for (var j1 in data.results.geometry.coordinates[i1]) {
                        this._infolist.push(data.results.geometry.coordinates[i1][j1]);
                    }
                }
            }
        }
    }
};

HDMap.DistrictResult.prototype = {
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

HDMap.districtResult = function(data) {
    return new HDMap.DistrictResult(data);
};

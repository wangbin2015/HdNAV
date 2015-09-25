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
            //��ȡ����������Ϣ
            for (var i in data.results) {
                if (data.results[i] instanceof Array) {
                    //�������ƻ�ȡ��������������Ϣ
                    var tempList = [];
                    for (var j in data.results[i]) {
                        tempList.push(new HDMap.DistrictResultInfo(data.results[i][j].district_name, data.results[i][j].district_code, data.results[i][j].district_class));
                    }
                    this._infolist.push(tempList);
                } else {
                    //���ݵ���λ�û�ȡ����������Ϣ
                    this._infolist.push(new HDMap.DistrictResultInfo(data.results[i].district_name, data.results[i].district_code, data.results[i].district_class));
                }
            }
        } else {
            //��ȡ������������Χ
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

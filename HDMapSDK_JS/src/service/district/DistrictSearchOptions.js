/**
 * Created by suntao on 2015/8/26.
 */
HDMap.DistrictSearchOptions = function (url, onSearchComplete) {
    //�жϲ����Ƿ���Ч
    if ((typeof url) !== 'string' || (typeof onSearchComplete) !== 'function') {
        throw new Error('Invalid DistrictSearchOptions object: (' + url + ', ' + onSearchComplete + ')');
    }
    this.url = url;
    this.onSearchComplete = onSearchComplete;
};

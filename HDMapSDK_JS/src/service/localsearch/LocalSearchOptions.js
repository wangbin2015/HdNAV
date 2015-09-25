/**
 * Created by CHENWENBIN on 2015/8/21.
 */
HDMap.LocalSearchOptions = function (url, onSearchComplete) {
    //判断参数是否有效
    if ((typeof url) !== 'string' || (typeof onSearchComplete) !== 'function') {
        throw new Error('Invalid LocalSearchOptions object: (' + url + ', ' + onSearchComplete + ')');
    }
    this.url = url;
    this.onSearchComplete = onSearchComplete;
};

HDMap.LocalSearchSetting = function (keyword, pageIndex, pageSize) {
    //判断参数是否有效
    if (typeof keyword !== 'string' || typeof pageIndex !== 'number' || typeof pageSize !== 'number') {
        throw new Error('Invalid LocalSearchSetting object: (' + keyword + ', ' + pageIndex + ',' + pageSize + ',' + ')');
    }
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
};

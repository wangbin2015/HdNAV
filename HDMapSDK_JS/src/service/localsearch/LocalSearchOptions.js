/**
 * Created by CHENWENBIN on 2015/8/21.
 */
HDMap.LocalSearchOptions = function (url, onSearchComplete) {
    //�жϲ����Ƿ���Ч
    if ((typeof url) !== 'string' || (typeof onSearchComplete) !== 'function') {
        throw new Error('Invalid LocalSearchOptions object: (' + url + ', ' + onSearchComplete + ')');
    }
    this.url = url;
    this.onSearchComplete = onSearchComplete;
};

HDMap.LocalSearchSetting = function (keyword, pageIndex, pageSize) {
    //�жϲ����Ƿ���Ч
    if (typeof keyword !== 'string' || typeof pageIndex !== 'number' || typeof pageSize !== 'number') {
        throw new Error('Invalid LocalSearchSetting object: (' + keyword + ', ' + pageIndex + ',' + pageSize + ',' + ')');
    }
    this.keyword = keyword;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
};

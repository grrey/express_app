const _ = require('lodash');

/**
 * 上下趋势
 * @param {qu} param0 
 * @deprecated
 */
exports.qushi = function({
    dataArr,
    fieldPath,
    upDirect, // ture 上升, false,下降,
    size = 5
}) {

    let hit = true;
    let vals = {};
    for (let i = 0; i < size; ++i) {
        let item = dataArr[i];
        if(!item){
          hit = false ;
        }
        vals[i] = _.get(item, fieldPath);
        if (i > 0) {
            hit = hit && (upDirect ? vals[i] < vals[i - 1] : vals[i] > vals[i - 1])
        }
    }
    return hit;
}

/**
 * 折点
 * @deprecated
 */
exports.zhedian = function({
    dataArr,
    fieldPath,
    upDirect, // ture 上升, false,下降,
    size = 3
}) {
    let hit = true;
    let vals = {};
    let index = 1000000 ;

    for (let i = 0; i < size; ++i) {
        let item = dataArr[i];
        vals[i] = _.get(item, fieldPath);
        if (i > 0) {
            hit = hit && (upDirect ? vals[i] < vals[i - 1] : vals[i] > vals[i - 1]);
            if (!hit) {
                index = i;
                break ;
            }
        }
    }
    return   index <= size ;

}

 
// var  bol = exports.qushi( {
//     dataArr: [  {a:41} , {a:11} , {a:31} , {a:41}  ],
//     fieldPath:'a',
//     upDirect: true ,
//     size:2
// })
// console.log(  bol )
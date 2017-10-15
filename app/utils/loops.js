/*
 * @Author: puxiao.wh 
 * @Date: 2017-10-11 11:05:54 
 * @Last Modified by:   puxiao.wh 
 * @Last Modified time: 2017-10-11 11:05:54 
 */

/**
 * @param { array } 原始数据
 * @param { cb } 回调函数
 */
exports.getNewArray = (array, cb) => {
    const _array = []
    if(array.length > 0) {
        for(let i = 0, l = array.length; i < l; i++) {
            _array.push(cb(array[i], i))
        }
    }
    return _array
}

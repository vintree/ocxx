/*
 * @Author: puxiao.wh 
 * @Date: 2017-10-11 11:40:18 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-14 17:17:23
 */

const moment = require('moment')
moment.locale('zh-cn')

exports.full = (time) => {
    return moment(time).format('YYYY年MM月DD日 HH:mm')
}

exports.relative = (time) => {
    return moment(time).startOf('minute').fromNow()
}
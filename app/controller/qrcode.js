/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 23:57:12
 */

// const serviceOfficial = require('../service/official')
// const log = require('../../config/log4js')
// const { success, fail } = require('../utils/returnUtil')
// const serviceOfficialUser = require('../service/officialUser')
const { checkWxToken } = require('../service/wx/util')
const serviceQrcode = require('../service/qrcode')
const getWxUnlimit = async (ctx, next) => {
    const isWxVaild = await checkWxToken()
    let { scene, page, width, auto_color, line_color } = ctx.query
    const dataQrcode = await serviceQrcode.getWxUnlimit({
        scene, 
        page, 
        width, 
        auto_color, 
        line_color
    })
    ctx.response.type = 'image/jpeg'
    ctx.response.body = dataQrcode
    // ctx.response.writeHead ='application/json'
}

module.exports = {
    'GET /rest/official/qrcode': getWxUnlimit
}

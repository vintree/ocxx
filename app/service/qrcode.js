/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 23:56:45
 */

// const daoOfficial = require('../dao/official')
// const daoOfficialInfo = require('../dao/officialInfo')
// const daoOfficialDynamic = require('../dao/officialDynamic')
// const serviceOfficialUser = require('../service/officialUser')
// const serviceOfficialDynamic = require('../service/officialDynamic')
// const loops = require('../utils/loops')

const post = require('../utils/request')
const { getWXSmallUnlimit } = require('../service/wx/util')
const fetch = require('node-fetch')
const fs = require('fs')

exports.getWxUnlimit = async(options) => {
    let { wxScene, wxPage, wxWidth, wxAutoColor, wxLineColor } = options
    // 二维码在50 - 200 之间
    wxWidth = wxWidth < 50 ? 50 : wxWidth
    wxWidth = wxWidth > 200 ? 200 : wxWidth
    let dataWxUnlimit = await getWXSmallUnlimit({
        wxScene, wxPage, wxWidth, wxAutoColor, wxLineColor
    })
    let dataWxUnlimitUrl = dataWxUnlimit.replace(global.config.officialQrcodePicPath, 'https://pic.ieee.top/official/qrcode/')
    return dataWxUnlimitUrl
}

/*
 * @Author: puxiao.wh 
 * @Date: 2017-10-09 00:27:08 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-21 15:43:06
 */

const _ = require('../../utils/request')
const fetch = require('node-fetch')


exports.getOpenIdAndSeesionKey = async (code) => {
    const wxData = await _.get('https://api.weixin.qq.com/sns/jscode2session', {
        appid: global.config.appId,
        secret: global.config.appSrcret,
        js_code: code,
        grant_type: 'authorization_code',
    })
    return {
        seesionKey: wxData.session_key,
        openId: wxData.openid
    }
}

// 确认token是否有效
exports.checkWxToken = async() => {
    let wxToken = global.wxToken
    let isValid = false
    if(wxToken) {
        const nowTime = Date.parse(new Date())
        isValid = (wxToken.create + wxToken.expires_in) - nowTime + 60000 > 0 ? true : false
        return isValid
    }
    return isValid
}

// 返回具体token
exports.getWXAccessToken = async() => {
    const isValid = await this.checkWxToken()
    if(isValid) {
        return global.wxToken.access_token
    } else {
        const accessToken = await _.get('https://api.weixin.qq.com/cgi-bin/token', {
            appid: global.config.appId,
            secret: global.config.appSrcret,
            grant_type: 'client_credential',
        })
        const wxToken = {
            ...accessToken,
            create: Date.parse(new Date())
        }
        global.wxToken = wxToken
        return wxToken.access_token
    }
}

// 获取无限制小程序图片二维码
exports.getWXSmallUnlimit = async(options) => {
    const accessToken = await this.getWXAccessToken()
    const { wxScene, wxPage, wxWidth, wxAutoColor, wxLineColor } = options
    const params = {
        scene: wxScene + '',
        path: wxPage + '',
        width: parseInt(wxWidth),
        auto_color: !!wxAutoColor,
        line_color: wxLineColor || {}
    }
    if(accessToken) {
        const fs = require('fs')        
        const res = await fetch(`https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`, {
            method: 'POST', 
            body: JSON.stringify(params),
        })
        let dest = fs.createWriteStream(`${global.config.officialQrcodePicPath}${wxPage.replace(/\//g,'_')}__${wxScene}__.png`);
        const dataPipe = res.body.pipe(dest);
        return dataPipe.path
    }
}

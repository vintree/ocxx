/*
 * @Author: puxiao.wh 
 * @Date: 2017-10-09 00:27:08 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-15 20:58:38
 */

const _ = require('../../utils/request')

exports.getOpenIdAndSeesionKey = async (code) => {
    const wxData = await _.get('https://api.weixin.qq.com/sns/jscode2session', {
        appid: global.config.appId,
        secret: global.config.appSrcret,
        js_code: code,
        grant_type: 'authorization_code',
    })
    console.log('wxData', wxData);
    return {
        seesionKey: wxData.session_key,
        openId: wxData.openid
    }
}
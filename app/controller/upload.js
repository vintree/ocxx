/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-19 15:48:30
 */

const serviceOfficialUser = require('../service/officialUser')
const serviceOfficial = require('../service/official')
const log = require('../../config/log4js')
const { success, fail } = require('../utils/returnUtil')

const uploadOfficialPic = async (ctx, next) => {
    // console.log('ss============', ctx.req.file);
    const { filename } = ctx.req.file

    const { wxSession, officialId } = ctx.req.body
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    const officialPicUrl = `https://pic.ieee.top/official/${filename}`
    ctx.response.type ='application/json'
    // 判断有权限账户
    if(dataSession.userInfo.officialId === officialId) {
        const dataSetUser = await serviceOfficial.setOfficialInfo({
            officialId: officialId,
            officialPicUrl: officialPicUrl
        })
        if(dataSetUser) {
            ctx.response.body = success({
                msg: 'uploadOfficialPic',
                data: {
                    officialPicUrl: officialPicUrl
                }
            })
        } else {
            ctx.response.body = fail({
                msg: 'uploadOfficialPic',
                data: {
                    success: false
                }
            })
        }
    } else {
        ctx.response.body = fail({
            msg: 'uploadOfficialPic',
            data: {
                success: false
            }
        })
    }
}

module.exports = {
    'POST /rest/official/uploadOfficialPic': uploadOfficialPic
};
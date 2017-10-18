/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-18 14:27:22
 */

const _ = require('../utils/request')
const daoCircle = require('../dao/officialCircle')
const serviceOfficial = require('../service/official')
const log = require('../../config/log4js')
const { success, fail } = require('../utils/returnUtil')
const serviceOfficialUser = require('../service/officialUser')

const getList = async (ctx, next) => {
    const { circleId, wxSessionCode } = ctx.query
    const dataOfficialList = await serviceOfficial.getOfficialList({
        circleId,
        wxSessionCode
    })
    ctx.response.type ='application/json'
    ctx.response.body = success({
        msg: 'getOfficialList',
        data: {
            officialList: dataOfficialList || []
        }
    })
}

const getOfficialDetail = async (ctx, next) => {
    const { wxSession, officialId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    let dataOfficialInfo = undefined
    if(dataSession.userInfo.userId) {
        dataOfficialInfo = await serviceOfficial.getOfficialDetail({
            officialId: officialId
        })
    }
    ctx.response.type ='application/json'
    if(dataOfficialInfo) {
        ctx.response.body = success({
            msg: 'getOfficialList',
            data: {
                officialInfo: dataOfficialInfo
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'getOfficialList',
            data: {
                officialInfo: dataOfficialInfo
            }
        })
    }
}

const setOfficialInfo = async(ctx) => {
    const { wxSession, officialId, officialAddress, officialDoorplate, officialDes, officialEmail, officialFullName, officialLat, officialLog, officialName, officialPhone, officialPic } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    ctx.response.type ='application/json'
    // 判断有权限账户
    if(dataSession.userInfo.officialId === officialId) {
        const dataSetOfficialInfo = await serviceOfficial.setOfficialInfo({
            officialId, officialAddress, officialDoorplate, officialDes, officialEmail, officialFullName, officialLat, officialLog, officialName, officialPhone, officialPic
        })
        ctx.response.body = success({
            msg: 'setOfficialInfo',
            data: {
                success: true
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'setOfficialInfo',
            data: {
                success: false
            }
        })
    }
}

module.exports = {
    'GET /rest/official/getList': getList,
    'GET /rest/official/getOfficialDetail': getOfficialDetail,
    'GET /rest/official/setOfficialInfo': setOfficialInfo
}

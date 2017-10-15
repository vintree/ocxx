/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-16 01:39:57
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

const getOfficialInfo = async (ctx, next) => {
    const { wxSession, officialId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    let dataOfficialInfo = undefined
    if(dataSession.userInfo.userId) {
        dataOfficialInfo = await serviceOfficial.getOfficialInfo({
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

module.exports = {
    'GET /rest/official/getList': getList,
    'GET /rest/official/getOfficialInfo': getOfficialInfo,
}

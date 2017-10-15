/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-16 01:49:52
 */

const log = require('../../config/log4js')
const _ = require('../utils/request')
const { success, fail } = require('../utils/returnUtil')
const serviceOfficialInfo = require('../service/officialInfo')
const serviceOfficialUser = require('../service/officialUser')
const serviceOfficial = require('../service/official')
const serviceOfficialDynamic = require('../service/officialDynamic')
const { getOpenIdAndSeesionKey } = require('../service/wx/util')

const create = async (ctx, next) => {
    const { wxSessionCode, officialInfoTitle, officialInfoContent } = ctx.query
    const dataCreate = await serviceOfficialInfo.create({
        wxSessionCode: wxSessionCode,
        officialInfoTitle: officialInfoTitle,
        officialInfoContent: officialInfoContent
    })

    ctx.response.type ='application/json'

    if(dataCreate.code === 200) {
        ctx.response.body = {
            success: true,
            ...dataCreate
        }
    }
}

const setOfficialInfo = async (ctx, next) => {
    const { wxSessionCode, officialInfoId, officialInfoTitle, officialInfoContent } = ctx.query
    const dataOfficialInfo = await serviceOfficialInfo.setOfficialInfo({
        wxSessionCode: wxSessionCode,
        officialInfoId: officialInfoId,
        officialInfoTitle: officialInfoTitle,
        officialInfoContent: officialInfoContent
    })
    ctx.response.type ='application/json'
    if(dataOfficialInfo) {
        ctx.response.body = success({
            msg: 'setOfficialInfo',
            data: {
                officialInfoId: dataOfficialInfo.officialInfoId
            }
        })
    }
}

const getTimeList = async (ctx, next) => {
    const { page, pageSize } = ctx.query
    const dataOfficialInfoList = await serviceOfficialInfo.getOfficialInfoTimeList({
        page,
        pageSize
    })
    if(dataOfficialInfoList) {
        ctx.response.type ='application/json'
        ctx.response.body = success({
            msg: 'officialInfoTimeList',
            data: {
                officialInfoList: dataOfficialInfoList
            }
        })
    }
}

const get = async (ctx, next) => {
    const { officialInfoId, wxSession } = ctx.query
    // 官方消息
    const dataOfficialInfo = await serviceOfficialInfo.getInfo({
        officialInfoId
    })

    // 官方信息
    const dataOfficial = await serviceOfficial.getOfficialInfo({
        officialId: dataOfficialInfo.officialId
    })

    // 获取用户信息
    let dataOfficialDynamic = undefined
    if(wxSession) {
        const dataSession = await serviceOfficialUser.wxDeSession({
            wxSession
        })
        if(dataSession && dataSession.userInfo.userId) {
            dataOfficialDynamic = await serviceOfficialDynamic.getUserInfoSupport({
                userId: dataSession.userInfo.userId,
                officialInfoId
            })
        }
    }

    if(dataOfficialInfo && dataOfficial) {
        ctx.response.type ='application/json'
        ctx.response.body = success({
            msg: 'getOfficialAndOfficialInfo',
            data: {
                officialInfo: dataOfficialInfo,
                official: dataOfficial,
                isOfficialInfoSupport: !!dataOfficialDynamic
            }
        })
    }
}

const getOfficialAndOfficialInfoList = async (ctx, next) => {
    const officialAndOfficialInfoListData = await serviceOfficialInfo.getOfficialAndOfficialInfoList({
        officialId: ctx.query.officialId
    })
    if(officialAndOfficialInfoListData.code === 200) {
        ctx.response.type ='application/json'
        ctx.response.body = {
            success: true,
            ...officialAndOfficialInfoListData
        }
    }
}

const del = async (ctx, next) => {
    const { wxSessionCode, officialInfoId } = ctx.query
    const dataOfficialInfo = await serviceOfficialInfo.setDelete({
        wxSessionCode: wxSessionCode,
        officialInfoId: officialInfoId
    })
    ctx.response.type ='application/json'
    if(dataOfficialInfo) {
        ctx.response.body = success({
            msg: 'setOfficialInfo',
            data: {
                success: true
            }
        })
    }
}

module.exports = {
    'GET /rest/official/info/create': create,
    'GET /rest/official/info/setOfficialInfo': setOfficialInfo,
    'GET /rest/official/info/getOfficialAndOfficialInfoList': getOfficialAndOfficialInfoList,
    'GET /rest/official/info/getTimeList': getTimeList,
    'GET /rest/official/info/get': get,
    'GET /rest/official/info/delete': del,
}

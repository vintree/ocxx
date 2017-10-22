/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-23 00:32:26
 */

const asyncHooks = require('async_hooks')
const cheerio = require('cheerio')
const _ = require('../utils/request')
const log = require('../../config/log4js')
const serviceOfficialDynamic = require('../service/officialDynamic')
const serviceOfficialUser = require('../service/officialUser')
const serviceOfficialInfo = require('../service/officialInfo')
const { success, fail } = require('../utils/returnUtil')

const focus = async (ctx, next) => {
    const { wxSession, officialId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    let options = {}

    if(dataSession.userInfo) {
        options = {
            userId: dataSession.userInfo.userId,
            officialId : officialId
        }
    }

    // 新增添加
    const dataOfficialDynamic = await serviceOfficialDynamic.createOfficialFocus(options)
    ctx.response.type ='application/json'
    if(dataOfficialDynamic) {
        ctx.response.body = success({
            msg: 'officialFocus',
            data: {
                isOfficialFocus: true
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'officialFocus',
            data: {
                isOfficialFocus: false
            }
        })
    }
}

const share = async (ctx, next) => {
    ctx.response.type ='application/json'
    const { wxSession, officialId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })


    const dataUser = await serviceOfficialUser.getUserDetail({
        userId: dataSession.userInfo.userId
    })
    const options = {}

    if(dataUser) {
        options = {
            userId: dataUser.userId,
            officialId : officialId
        }
    }

    const dataOfficialDynamic = await serviceOfficialDynamic.createOfficialShare(options)
    if(dataOfficialDynamic) {
        ctx.response.body = success({
            msg: 'officialShare',
            data: {
                success: true
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'officialShare',
            data: {
                success: false
            }
        })
    }
}

const infoShare = async (ctx, next) => {
    const { wxSession, officialId, officialInfoId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    let options = {}

    if(dataSession) {
        options = {
            userId: dataSession.userInfo.userId,
            officialInfoId : officialInfoId,
            officialId: officialId
        }
        // 添加动态
        const dataOfficialDynamic = await serviceOfficialDynamic.createOfficialInfoShare(options)
        ctx.response.type ='application/json'
        if(dataOfficialDynamic) {
            // 动态成功后
            const dataOfficialInfo = await serviceOfficialInfo.addShare({
                officialInfoId: officialInfoId
            })
            if(dataOfficialInfo) {
                ctx.response.body = success({
                    msg: 'infoShare',
                    data: {
                        isInfoShare: true,
                        officialInfoShare: dataOfficialInfo.officialInfoShare
                    }
                })
            }
        } else {
            ctx.response.body = fail({
                msg: 'infoShare',
                data: {
                    isInfoShare: false
                }
            })
        }
    } else {
        ctx.response.body = fail({
            msg: 'infoShare',
            data: {
                isInfoShare: false
            }
        })
    }
}

const infoSupport = async (ctx, next) => {
    const { wxSession, officialId, officialInfoId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    if(dataSession) {
        let options = {
            userId: dataSession.userInfo.userId,
            officialInfoId : officialInfoId,
            officialId: officialId
        }
        // 添加动态
        const dataOfficialDynamic = await serviceOfficialDynamic.createOfficialInfoSupport(options)
        ctx.response.type ='application/json'
        if(dataOfficialDynamic) {
            // 动态成功后
            const dataOfficialInfo = await serviceOfficialInfo.addSupport({
                officialInfoId: officialInfoId
            })
            if(dataOfficialInfo) {
                ctx.response.body = success({
                    msg: 'infoSupport',
                    data: {
                        isInfoSupport: true,
                        officialInfoSupport: dataOfficialInfo.officialInfoSupport
                    }
                })
            }
        } else {
            ctx.response.body = fail({
                msg: 'infoSupport',
                data: {
                    isInfoSupport: false
                }
            }) 
        }
    } else {
        ctx.response.body = fail({
            msg: 'infoSupport',
            data: {
                isInfoSupport: false
            }
        }) 
    }
}

const getList = async (ctx, next) => {
    const { wxSession } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })

    ctx.response.type ='application/json'    
    if(dataSession) {
        const dataServiceOfficialDynamic = await serviceOfficialDynamic.getDynamicList({
            userId: dataSession.userInfo.userId
        })
        ctx.response.body = success({
            msg: 'getDynmaicList',
            data: {
                dynamicList: dataServiceOfficialDynamic,
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'getDynmaicList',
            data: {
                dynamicList: []
            }
        })
    }
}

module.exports = {
    'GET /rest/official/dynamic/getList': getList,
    'GET /rest/official/dynamic/focus': focus,
    'GET /rest/official/dynamic/share': share,
    'GET /rest/official/dynamic/infoShare': infoShare,
    'GET /rest/official/dynamic/infoSupport': infoSupport,
}

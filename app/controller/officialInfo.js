/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 23:41:38
 */

const log = require('../../config/log4js')
const _ = require('../utils/request')
const { success, fail } = require('../utils/returnUtil')
const serviceOfficialInfo = require('../service/officialInfo')
const serviceOfficialUser = require('../service/officialUser')
const serviceOfficial = require('../service/official')
const serviceOfficialDynamic = require('../service/officialDynamic')
const serviceQrcpde = require('../service/qrcode')
const { getOpenIdAndSeesionKey } = require('../service/wx/util')
const { getAsyncNewArray } = require('../utils/loops')

const create = async (ctx, next) => {
    const { 
        wxSession, officialInfoTitle, officialInfoContent, 
        wxScene, wxPage, wxWidth, wxAutoColor, wxLineColor 
    } = ctx.query
    
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    let dataOfficialInfo = undefined
    let dataCreate = undefined
    
    const dataOfficialUser = await serviceOfficialUser.getUserDetail({
        userId: dataSession.userInfo.userId
    })
    if(dataOfficialUser) {
        const officialId = dataOfficialUser.officialId

        dataCreate = await serviceOfficialInfo.create({
            officialId: officialId,
            officialInfoTitle: officialInfoTitle,
            officialInfoContent: officialInfoContent,
        })
        
        if(officialId) {
            // 获取小程序二维码
            const officialInfoWXQrcodePicUrl = await serviceQrcpde.getWxUnlimit({
                wxScene: `${dataCreate.officialInfoId}`,
                wxPage,
                wxWidth,
                wxAutoColor,
                wxLineColor
            })
        
            dataOfficialInfo = await serviceOfficialInfo.setOfficialInfo({
                officialId: officialId,
                officialInfoId: dataCreate.officialInfoId,
                officialInfoWXQrcodePicUrl: officialInfoWXQrcodePicUrl
            })
        }
    }

    ctx.response.type ='application/json'
    if(dataOfficialInfo) {
        ctx.response.body = success({
            msg: 'createOfficialInfo',
            data: {
                success: true,
                ...dataCreate
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'createOfficialInfo',
            data: {
                success: false
            }
        })
    }
}

const setOfficialInfo = async (ctx, next) => {
    ctx.response.type ='application/json'
    const { wxSession, officialInfoId, officialInfoTitle, officialInfoContent } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    if(dataSession.userInfo) {
        const dataUser = await serviceOfficialUser.getUserDetail({
            userId: dataSession.userInfo.userId
        })
        const dataOfficialInfo = await serviceOfficialInfo.setOfficialInfo({
            officialId: dataUser.officialId,
            officialInfoId: officialInfoId,
            officialInfoTitle: officialInfoTitle,
            officialInfoContent: officialInfoContent
        })
        if(dataOfficialInfo) {
            ctx.response.body = success({
                msg: 'setOfficialInfo',
                data: {
                    officialInfoId: dataOfficialInfo.officialInfoId
                }
            })
        } else {
            ctx.response.body = fail({
                msg: 'setOfficialInfo',
                data: {
                    officialInfoId: ''
                }
            })    
        }
    } else {
        ctx.response.body = fail({
            msg: 'setOfficialInfo',
            data: {
                officialInfoId: ''
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
    const dataOfficial = await serviceOfficial.getOfficialDetail({
        officialId: dataOfficialInfo.officialId
    })

    // 获取用户操作信息
    let dataOfficialDynamic = undefined
    let isOneself = false
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

        const dataOfficialUser = await serviceOfficialUser.getUserDetail({
            userId: dataSession.userInfo.userId
        })
        isOneself = dataOfficialUser.officialId === dataOfficialInfo.officialId
    }

    if(dataOfficialInfo && dataOfficial) {
        ctx.response.type ='application/json'
        ctx.response.body = success({
            msg: 'getOfficialAndOfficialInfo',
            data: {
                officialInfo: dataOfficialInfo,
                official: dataOfficial,
                isOfficialInfoSupport: !!dataOfficialDynamic,
                isOneself: isOneself
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

const getUserFocusOfficialInfoList = async(ctx, next) => {
    ctx.response.type ='application/json'
    const { wxSession, page, pageSize } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })

    // 存在
    if(dataSession && dataSession.userInfo) {
        const dataOfficialList = await serviceOfficialDynamic.getDynamicOfficialFocusList({
            userId: dataSession.userInfo.userId
        })

        const dataOfficialIds = await getAsyncNewArray(dataOfficialList, (item) => {
            return item.officialId
        })

        const dataUserFocusOfficialInfoList = await serviceOfficialInfo.getUserFocusOfficialInfoList({
            officialIds: dataOfficialIds,
            page,
            pageSize
        })

        if(dataUserFocusOfficialInfoList) {
            ctx.response.body = success({
                msg: 'getUserFocusOfficialInfoList',
                data: {
                    success: true,
                    officialInfoList: dataUserFocusOfficialInfoList
                }
            })
        } else {
            ctx.response.body = fail({
                msg: 'getUserFocusOfficialInfoList',
                data: {
                    success: false
                }
            })
        }
    }
}

const getOfficialInfoList = async (ctx, next) => {
    const { officialId, page, pageSize } = ctx.query
    const dataOfficialInfoList = await serviceOfficialInfo.getOfficialInfoList({
        officialId,
        page,
        pageSize
    })

    ctx.response.type ='application/json'
    if(dataOfficialInfoList) {
        ctx.response.body = success({
            msg: 'getOfficialInfoList',
            data: {
                officialInfoList: dataOfficialInfoList,
                success: true
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'getOfficialInfoList',
            data: {
                officialInfoList: [],
                success: true
            }
        })
    }
}

const del = async (ctx, next) => {
    ctx.response.type ='application/json'
    const { wxSession, officialInfoId } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    // 查询用户的officialId
    const dataUser = await serviceOfficialUser.getUserDetail({
        userId: dataSession.userInfo.userId
    })
    
    let dataOfficialInfo = undefined
    if(dataUser.officialId) {
        dataOfficialInfo = await serviceOfficialInfo.setDelete({
            officialId: dataUser.officialId,
            officialInfoId: officialInfoId
        })
    }
    
    if(dataOfficialInfo) {
        ctx.response.body = success({
            msg: 'officialInfoDelete',
            data: {
                success: true
            }
        })
    } else {
        ctx.response.body = success({
            msg: 'officialInfoDelete',
            data: {
                success: false
            }
        })
    }
}

module.exports = {
    'GET /rest/official/info/create': create,
    'GET /rest/official/info/setOfficialInfo': setOfficialInfo,
    'GET /rest/official/info/getOfficialAndOfficialInfoList': getOfficialAndOfficialInfoList,
    'GET /rest/official/info/getUserFocusOfficialInfoList': getUserFocusOfficialInfoList,
    'GET /rest/official/info/getOfficialInfoList': getOfficialInfoList,
    'GET /rest/official/info/getTimeList': getTimeList,
    'GET /rest/official/info/get': get,
    'GET /rest/official/info/delete': del,
}

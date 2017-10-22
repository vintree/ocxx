/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 13:18:03
 */

const _ = require('../utils/request')
const daoCircle = require('../dao/officialCircle')
const serviceOfficial = require('../service/official')
const log = require('../../config/log4js')
const { success, fail } = require('../utils/returnUtil')
const serviceOfficialUser = require('../service/officialUser')

const create = async (ctx, next) => {
    ctx.response.type ='application/json'
    const { 
        wxSession,
        circleId,
        officialName,
        officialFullName,
        officialEmail,
        officialPhone,
        officialDes,
        officialLat,
        officialLog,
        officialAddress,
        officialDoorplate,
        officialPicUrl
    } = ctx.query
    
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    
    const dataUser = await serviceOfficialUser.getUserDetail({
        userId: dataSession.userInfo.userId
    })

    let officialId = undefined
    if(dataUser) {
        if(!dataUser.officialId) {
            // 创建机构
            const dataCreate = await serviceOfficial.create({
                circleId,
                officialName,
                officialFullName,
                officialEmail,
                officialPhone,
                officialDes,
                officialLat,
                officialLog,
                officialAddress,
                officialDoorplate,
                officialPicUrl
            })
            // 机构挂在到用户
            if(dataCreate) {
                const dataUserInfo = await serviceOfficialUser.setUserInfo({
                    userId: dataUser.userId
                }, {
                    officialId: dataCreate.officialId.toString()
                })
                if(dataUserInfo) {
                    ctx.response.body = success({
                        msg: 'createOfficial',
                        data: {
                            success: true
                        }
                    })
                }
            }
        }
    }
}

const getList = async (ctx, next) => {
    const { circleId, wxSession, page, pageSize } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })

    const dataOfficialList = await serviceOfficial.getOfficialList({
        circleId,
        userId: dataSession.userInfo.userId,
        page,
        pageSize
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
            officialId: officialId,
            userId: dataSession.userInfo.userId
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
    const { wxSession, officialId, officialAddress, officialDoorplate, officialDes, officialEmail, officialFullName, officialLat, officialLog, officialName, officialPhone, officialPicUrl } = ctx.query
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    ctx.response.type ='application/json'

    // 获取用户官方信息
    const dataUserInfo = await serviceOfficialUser.getUserDetail({
        userId: dataSession.userInfo.userId
    })

    // 判断有权限账户
    if(dataUserInfo.officialId === officialId) {
        const dataSetOfficialInfo = await serviceOfficial.setOfficialInfo({
            officialId, officialAddress, officialDoorplate, officialDes, officialEmail, officialFullName, officialLat, officialLog, officialName, officialPhone, officialPicUrl
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
    'GET /rest/official/create': create,
    'GET /rest/official/getList': getList,
    'GET /rest/official/getOfficialDetail': getOfficialDetail,
    'GET /rest/official/setOfficialInfo': setOfficialInfo
}

/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 16:46:50
 */

const log = require('../../config/log4js')
const { getOpenIdAndSeesionKey } = require('../service/wx/util')
const serviceOfficialUser = require('../service/officialUser')
const { success, fail } = require('../utils/returnUtil')

const createOrUpdate = async (ctx, next) => {
    const sqlObj = {
        phone: ctx.query.phone,
        nickName: ctx.query.nickName,
        gender: ctx.query.gender,
        province: ctx.query.province,
        city: ctx.query.city,
        country: ctx.query.country,
        avatarUrl: ctx.query.avatarUrl,
        isShow: true,
        isActive: true
    }
    const auxObj = {
        code: ctx.query.code
    }
    const officialUserData = await serviceOfficialUser.createUser(sqlObj, auxObj)
    if(officialUserData.code === 200) {
        ctx.response.type ='application/json'
        ctx.response.body = {
            code: officialUserData.code,
            msg: officialUserData.msg,
            data: {
                success: true,
                userInfo: officialUserData.data
            },
            success: true
        }
    }
}

// 未注册用户自动注册
const valid = async (ctx, next) => {
    ctx.response.type ='application/json'
    const { wxSession } = ctx.query
    // 获取用户信息
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })

    if(dataSession.userInfo) {
        const dataOfficialUser = await serviceOfficialUser.getUserDetail({
            userId: dataSession.userInfo.userId
        })
        // 找到用户
        if(dataOfficialUser) {
            ctx.response.body = success({
                msg: 'getUser',
                data: {
                    userInfo: {
                        avatarUrl: dataOfficialUser.avatarUrl,
                        city: dataOfficialUser.city,
                        country: dataOfficialUser.country,
                        gender: dataOfficialUser.gender,
                        nickName: dataOfficialUser.nickName,
                        officialId: dataOfficialUser.officialId,
                        phone: dataOfficialUser.phone,
                        province: dataOfficialUser.province,
                        userId: dataOfficialUser.userId,
                    }
                }
            })
        } else {
            ctx.response.body = fail({
                msg: 'getUser',
                data: {
                    userInfo: {}
                }
            })
        }
    } else {
        ctx.response.body = fail({
            msg: 'getUser',
            data: {
                userInfo: {}
            }
        })
    }
}

// 设置wxSession && 自动注册
const getWxSession = async(ctx, next) => {
    ctx.response.type ='application/json'
    const { 
        wxSessionCode,
        phone, 
        nickName, 
        gender, 
        province, 
        city, 
        country, 
        avatarUrl 
    } = ctx.query

    // 通过wxSessionCode 获取 openId 查询 userInfo
    const dataWX = await getOpenIdAndSeesionKey(wxSessionCode)
    // 获取userInfo
    let dataOfficialUser = await serviceOfficialUser.getUserInfo({
        wxOpenId: dataWX.openId
    })

    let dataSession = undefined
    if(dataOfficialUser) {
        // 用户已注册
        dataSession = await serviceOfficialUser.wxEnSession({
            userInfo: dataOfficialUser
        })
    } else {
        // 用户未注册，进行注册
        dataOfficialUser = await serviceOfficialUser.createNotWXSessionCode({
            openId: dataWX.openId,
            phone, 
            nickName, 
            gender, 
            province, 
            city, 
            country, 
            avatarUrl
        })
        if(dataOfficialUser) {
            // 注册成功，获取wxSession
            dataSession = await serviceOfficialUser.wxEnSession({
                userInfo: dataOfficialUser
            })
        }
    }

    if(dataSession) {
        ctx.response.body = success({
            msg: 'getWxSession',
            data: {
                wxSession: dataSession
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'getWxSession',
            data: {
                wxSession: dataSession
            }
        })
    }
}

// 得到session内容
const deWxSession = async(ctx, next) => {
    const { wxSession } = ctx.query
    const dataDeSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })

    ctx.response.type ='application/json'
    if(dataDeSession) {
        ctx.response.body = success({
            msg: 'setSession',
            data: {
                session: dataDeSession
            }
        })
    } else {
        ctx.response.body = fail({
            msg: 'setSession',
            data: {
                session: dataDeSession
            }
        })
    }
}

module.exports = {
    'GET /rest/official/user/createOrUpdate': createOrUpdate,
    'GET /rest/official/user/valid': valid,
    'GET /rest/official/user/getWxSession': getWxSession,
    'GET /rest/official/user/deWxSession': deWxSession
}

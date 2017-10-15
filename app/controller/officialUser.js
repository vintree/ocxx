/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-16 01:19:05
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
    // console.log('officialUserDatas', officialUserData);
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
    // const { wxSession, phone, nickName, gender, province, city, country, avatarUrl } = ctx.query
    const { wxSession } = ctx.query

    // 获取用户信息
    const dataSession = await serviceOfficialUser.wxDeSession({
        wxSession
    })
    ctx.response.type ='application/json'
    // 找到用户
    if(dataSession) {
        ctx.response.body = success({
            msg: 'getUser',
            data: {
                userInfo: {
                    avatarUrl: dataSession.userInfo.avatarUrl,
                    city: dataSession.userInfo.city,
                    country: dataSession.userInfo.country,
                    gender: dataSession.userInfo.gender,
                    nickName: dataSession.userInfo.nickName,
                    officialId: dataSession.userInfo.officialId,
                    phone: dataSession.userInfo.phone,
                    province: dataSession.userInfo.province,
                    userId: dataSession.userInfo.userId
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
    // else {
    //     // 注册用户
    //     if(dataUser.wxOpenId) {
    //         const dataCreateUser = await serviceOfficialUser.create({
    //             wxSessionCode, phone, nickName, gender, province, city, country, avatarUrl
    //         })
    //         if(dataCreateUser.code === 200) {
    //             ctx.response.body = success({
    //                 msg: 'createUser',
    //                 data: {
    //                     userInfo: dataCreateUser
    //                 }
    //             })
    //         }
    //     } else {
    //         // 微信注册失败
    //         ctx.response.body = fail({
    //             msg: 'createUser',
    //             data: {
    //                 userInfo: undefined
    //             }
    //         })
    //     }
    // }
}

// 设置wxSession
const getWxSession = async(ctx, next) => {
    const { wxSession, wxSessionCode } = ctx.query
    let dataSession = ''
    if(wxSession) {

    } else {
        // 没有session时，创建session
        dataSession = await serviceOfficialUser.wxEnSession({
            wxSessionCode
        })
    }
    ctx.response.type ='application/json'
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
    let dataDeSession = ''
    dataDeSession = await serviceOfficialUser.wxDeSession({
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

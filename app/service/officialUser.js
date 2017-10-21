/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-22 02:17:45
 */
const { getOpenIdAndSeesionKey } = require('./wx/util')
const { success, fail } = require('../utils/returnUtil')
const daoOfficialUser = require('../dao/officialUser')
const mongo = require('mongodb')

exports.create = async (options) => {
    const dataWX = await getOpenIdAndSeesionKey(options.wxSessionCode)
    let save = {
        wxOpenId: dataWX.openId,
        phone: options.phone, 
        nickName: options.nickName, 
        gender: options.gender, 
        province: options.province, 
        city: options.city, 
        country: options.country, 
        avatarUrl: options.avatarUrl,
        isShow: true,
        isActive: true,
        isDelete: false,
    }
    const dataOfficialUser = await daoOfficialUser.create(save)
    if(dataOfficialUser) {
        return success({
            msg: 'create',
            data: {
                userInfo: dataOfficialUser
            }
        })
    }
    return fail({
        msg: 'create',
        data: {
            userInfo: dataOfficialUser || {}
        }
    })
}

exports.createNotWXSessionCode = async (options) => {
    let save = {
        wxOpenId: options.openId,
        phone: options.phone, 
        nickName: options.nickName, 
        gender: options.gender, 
        province: options.province, 
        city: options.city, 
        country: options.country, 
        avatarUrl: options.avatarUrl,
        isShow: true,
        isActive: true,
        isDelete: false,
    }
    const dataOfficialUser = await daoOfficialUser.create(save)
    if(dataOfficialUser) {
        dataOfficialUser.userId = dataOfficialUser._id
        delete dataOfficialUser._id
        return dataOfficialUser
    } else {
        return undefined
    }
}

exports.setUserInfo = async(query, update) => {
    let dataOfficial = undefined
    // 获取合法用户 && 获取 officialId
    query = {
        _id : query.userId.toString()
    }
    update = {
        $set: {
            ...update
        }
    }
    dataOfficial = await daoOfficialUser.set(query, update, {})
    return dataOfficial
}

// 切勿再次使用，查询用户是否存在
exports.getUserInfo = async (options) => {
    const dataWX = await getOpenIdAndSeesionKey(options.wxSessionCode)
    const query = {
        wxOpenId: dataWX.openId,
        isShow: true,
        isActive: true
    }
    const find = {
        wxOpenId: 0,
        isActive: 0,
        isShow: 0,
        createTime: 0
    }
    const dataValidUser = await daoOfficialUser.get(query, find)
    if(dataValidUser.length === 0) {
        return undefined
    }
    dataValidUser[0].userId = dataValidUser[0]._id.toString()
    delete dataValidUser[0]._id
    return dataValidUser[0]
}

exports.getUserDetail = async (options) => {
    const query = {
        _id: options.userId,
        isShow: true,
        isActive: true
    }
    const find = {
        wxOpenId: 0,
        isActive: 0,
        isShow: 0,
        createTime: 0
    }
    const dataValidUser = await daoOfficialUser.get(query, find)
    if(dataValidUser.length === 0) {
        return undefined
    }
    dataValidUser[0].userId = dataValidUser[0]._id.toString()
    delete dataValidUser[0]._id
    return dataValidUser[0]
}

// 查询Session用户是否存在
exports.getSessionUserInfo = async (options) => {
    const dataWX = await getOpenIdAndSeesionKey(options.wxSessionCode)
    const query = {
        wxOpenId: dataWX.openId,
        isShow: true,
        isActive: true
    }
    const find = {}
    let dataValidUser = await daoOfficialUser.get(query, find)
    
    // 未注册用户
    if(dataValidUser.length === 0) {
        return {
            ...dataWX,
            type: 'unregistered'
        }
    }
    
    // 已注册用户
    dataValidUser = dataValidUser[0]
    dataValidUser = {
        ...dataValidUser,
        userId: dataValidUser._id.toString(),
        ...dataWX
    }
    delete dataValidUser._id
    
    return dataValidUser
}

exports.wxEnSession = async(options) => {
    const crypto = require('../utils/crypto')
    let enSession = undefined
    enSession = crypto.cipher(JSON.stringify({
        userInfo: options.userInfo,
        maxAge: 86400000 * 365,
        create: Date.parse(new Date())
    }))
    return enSession
}

exports.wxDeSession = async(options) => {
    const crypto = require('../utils/crypto')
    const { wxSession } = options
    const deSession = crypto.decipher(wxSession) || '{}'
    return JSON.parse(deSession)
}

/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-16 00:54:02
 */
const { getOpenIdAndSeesionKey } = require('./wx/util')
const { success, fail } = require('../utils/returnUtil')
const daoOfficialUser = require('../dao/officialUser')
const mongo = require('mongodb')

exports.create = async (options) => {    
    const dataWX = await getOpenIdAndSeesionKey(options.wxSessionCode)
    
    const save = {
        wxOpenId: dataWX.openId,
        phone, 
        nickName, 
        gender, 
        province, 
        city, 
        country, 
        avatarUrl
    } = options

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

// 查询用户是否存在
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
    
    if(dataValidUser.length === 0) {
        return undefined
    }

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
    const dataGetSessionUserInfo = await this.getSessionUserInfo({
        wxSessionCode: options.wxSessionCode
    })

    if(dataGetSessionUserInfo) {
        const enSession = crypto.cipher(JSON.stringify({
            userInfo: dataGetSessionUserInfo,
            maxAge: 86400000 * 365,
            create: Date.parse(new Date())
        }))
        return enSession
    }
    return undefined
}

exports.wxDeSession = async(options) => {
    const crypto = require('../utils/crypto')
    const { wxSession } = options
    const deSession = crypto.decipher(wxSession) || '{}'
    return JSON.parse(deSession)
}

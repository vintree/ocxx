/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-23 15:59:21
 */

const mongo = require('mongodb')
const ObjectID = mongo.ObjectID
const {
    success,
    fail
} = require('../utils/returnUtil')
const daoOfficial = require('../dao/official')
const daoOfficialDynamic = require('../dao/officialDynamic')
const loops = require('../utils/loops')
const textCut = require('../utils/textCut')
const time = require('../utils/time')

// create ---------------------------------------------------------

exports.createOfficialFocus = async(options) => {
    const data = {
        userId: options.userId + '',
        officialId : options.officialId + '',
        officialInfoId: undefined,
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.create(data)
}

exports.deleteOfficialFocus = async(options) => {
    const data = {
        userId: options.userId + '',
        officialId : options.officialId + '',
        officialInfoId: undefined,
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.create(data)
}

exports.createOfficialShare = async(options) => {
    const data = {
        userId: options.userId + '',
        officialId : options.officialId + '',
        officialInfoId: undefined,
        typeCode: 1001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.create(data)
}

exports.createOfficialInfoShare = async(options) => {
    const data = {
        userId: options.userId + '',
        officialId : options.officialId + '',
        officialInfoId: options.officialInfoId + '',        
        typeCode: 2001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.create(data)
}

exports.createOfficialInfoSupport = async(options) => {
    const data = {
        userId: options.userId + '',
        officialId : options.officialId + '',
        officialInfoId: options.officialInfoId + '',
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataDynamic = await daoOfficialDynamic.create(data)
    return dataDynamic ? dataDynamic[0] : undefined
}

// set --------------------------------------
exports.setOfficialFocus = async(options) => {
    const query = {
        _id : options.officialDynamicId.toString(),
    }
    delete options.officialDynamicId

    const update = {
        $set: {
            ...options,
            update: Date.parse(new Date())
        }
    }
    return await daoOfficialDynamic.set(query, update)
}

// get --------------------------------------

exports.getDynamicList = async(options) => {
    const data = {
        userId : options.userId + '',
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.get(data)
}

// 获取用户关注信息
exports.getDynamicOfficialFocusList = async(options) => {
    const query = {
        userId : options.userId + '',
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const find = {
        officialId: 1
    }
    return await daoOfficialDynamic.get(query, find)
}

// 查询用户关注的信息是否存在
exports.getUserPureOfficialFocusList = async(options = {}) => {
    const data = {
        userId: options.userId,
        officialId : options.officialId + '',
        typeCode: 1003
    }
    let dataOfficialFocusList = await daoOfficialDynamic.get(data) || []
    dataOfficialFocusList = loops.getAsyncNewArray(dataOfficialFocusList, (item) => {
        item.officialDynamicId = item._id.toString()
        delete item._id
        return item
    })
    return dataOfficialFocusList
}

exports.getOfficialFocusCount = async(options) => {
    const data = {
        officialId : options.officialId + '',
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialFocusCount = await daoOfficialDynamic.get(data) || []
    return dataOfficialFocusCount.length
}

exports.getUserFocusCount = async(options) => {
    const data = {
        userId : options.userId + '',
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

exports.getOfficialShareCount = async(options) => {
    const data = {
        officialId : options.officialId + '',
        typeCode: 2001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

exports.getOfficialSupportCount = async(options) => {
    const data = {
        officialId: options.officialId + '',
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data)
    return dataOfficialDynamic.length
}

exports.getOfficialInfoShareCount = async(options) => {
    const data = {
        officialInfo : options.officialInfo + '',
        typeCode: 2001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

exports.getUserInfoShareCount = async(options) => {
    const data = {
        userId: options.userId + '',
        typeCode: 2001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

exports.getOfficialInfoSupportCount = async(options) => {
    const data = {
        officialInfoId : options.officialInfo + '',
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

exports.getUserInfoSupportCount = async(options) => {
    const data = {
        userId: options.userId + '',
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(data) || []
    return dataOfficialDynamic.length
}

// get --------------------------------------

exports.getUserInfoSupport = async(options) => {
    const query = {
        userId: options.userId + '',
        officialInfoId: options.officialInfoId + '',
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(query)
    return dataOfficialDynamic[0]
}

exports.getOfficialFocus = async(options) => {
    const query = {
        userId: options.userId + '',
        officialId: options.officialId + '',
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(query)
    return dataOfficialDynamic[0]
}
/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-14 21:17:46
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
        userId: options.userId,
        officialId : options.officialId,
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
        userId: options.userId,
        officialId : options.officialId,
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
        userId: options.userId,
        officialId : undefined,
        officialInfoId: options.officialInfoId,        
        typeCode: 2001,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    return await daoOfficialDynamic.create(data)
}

exports.createOfficialInfoSupport = async(options) => {
    const data = {
        userId: options.userId,
        officialId : undefined,
        officialInfoId: options.officialInfoId,
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataDynamic = await daoOfficialDynamic.create(data)
    return dataDynamic ? dataDynamic[0] : undefined
}

// get --------------------------------------

exports.getOfficialFocusCount = async(options) => {
    const data = {
        officialId : options.officialId,
        typeCode: 1003,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getUserFocusCount = async(options) => {
    const data = {
        userId : options.userId,
        typeCode: 1003,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getOfficialShareCount = async(options) => {
    const data = {
        officialId : options.officialId,
        typeCode: 1001,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getUserShareCount = async(options) => {
    const data = {
        userId: options.userId,
        typeCode: 1001,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getOfficialInfoShareCount = async(options) => {
    const data = {
        officialInfo : options.officialInfo,
        typeCode: 2001,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getUserInfoShareCount = async(options) => {
    const data = {
        userId: options.userId,
        typeCode: 2001,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getOfficialInfoSupportCount = async(options) => {
    const data = {
        officialInfoId : options.officialInfo,
        typeCode: 2002,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

exports.getUserInfoSupportCount = async(options) => {
    const data = {
        userId: options.userId,
        typeCode: 2002,
        isShow: true,
        isActive: true
    }
    return await daoOfficialDynamic.get(data)
}

// get --------------------------------------

exports.getUserInfoSupport = async(options) => {
    console.log('options', options);
    const query = {
        userId: options.userId,
        officialInfoId: options.officialInfoId,
        typeCode: 2002,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(query)
    return dataOfficialDynamic[0]
}

exports.getOfficialFocus = async(options) => {
    console.log('options', options);
    const query = {
        userId: options.userId,
        officialId: options.officialId,
        typeCode: 1003,
        isShow: true,
        isActive: true,
        isDelete: false
    }
    const dataOfficialDynamic = await daoOfficialDynamic.get(query)
    return dataOfficialDynamic[0]
}
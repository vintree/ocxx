/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-19 02:20:07
 */

const mongo = require('mongodb')
const ObjectID = mongo.ObjectID
const {
    success,
    fail
} = require('../utils/returnUtil')
const { getOpenIdAndSeesionKey } = require('./wx/util')
const daoOfficial = require('../dao/official')
const daoOfficialInfo = require('../dao/officialInfo')
const daoOfficialUser = require('../dao/officialUser')
const serviceOfficialUser = require('../service/officialUser')
const serviceOfficial = require('../service/official')
const loops = require('../utils/loops')
const textCut = require('../utils/textCut')
const time = require('../utils/time')

exports.create = async(options) => {
    const dataWX = await getOpenIdAndSeesionKey(options.wxSessionCode)
    const dataOfficialUser = await daoOfficialUser.get({
        wxOpenId: dataWX.openId
    })
    // 用户是否存在
    if(dataOfficialUser) {
        const save = {
            officialId : dataOfficialUser[0].officialId,
            officialInfoTitle : options.officialInfoTitle,
            officialInfoContent : options.officialInfoContent,
            officialInfoSupport : 0,
            officialInfoShare : 0,
            isShow : true,
            isActive : true,
            isDelete: false,
            update : undefined
        }
        // 创建消息
        const dataCreateOfficialInfo = await daoOfficialInfo.create(save)
        if(dataCreateOfficialInfo) {
            return success({
                msg: 'createOfficialInfo',
                data: {
                    success: true,
                    officialInfoId: dataCreateOfficialInfo[0]._id
                }
            })
        }
    }
    return fail({
        msg: 'createOfficialInfo',
        data: {
            success: false,
        }
    })
}

// 官方的信息
// exports.getOfficialInfoList = async(options) => {
//     try {
//         let officialInfoList = await daoOfficialInfo.get({
//             officialId: options.officialId,
//             isShow: true,
//             isActive: true
//         }, {}, {
//             create: 1
//         })

//         const _officialInfoList = loops.getNewArray(officialInfoList, (item) => {
//             item.officialInfoId = item._id
//             item.officialInfoCutContent = item.officialInfoContent.length > 35 ? `${item.officialInfoContent.slice(0, 36)}...` : item.officialInfoContent
//             item.officialInfoCutContent = textCut.cut({
//                 key: '1',
//                 text: item.officialInfoContent
//             })
//             item.createRelative = time.relative(item.create)
//             item.createFull = time.full(item.create)

//             delete item._id
//             delete item.officialInfoContent
//             return item
//         })

//         return success({
//             msg: 'getOfficialInfoList',
//             data: {
//                 success: true,
//                 officialInfoList: _officialInfoList
//             }
//         })
//     } catch(e) {
//         console.error(e)
//     }
//     return fail({
//         msg: 'getOfficialInfoList',
//         data: {
//             success: false,
//             officialInfoList: []
//         }
//     })
// }

// 时间流官方信息
exports.getOfficialInfoTimeList = async(options) => {
    try {
        let officialInfoList = await daoOfficialInfo.get({
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            pageSize: options.pageSize,
            page: options.page,
        }, {
            create: -1
        })

        let _officialInfoList = undefined
        if(officialInfoList) {
            _officialInfoList = loops.getAsyncNewArray(officialInfoList, async(item) => {
                item.officialInfoId = item._id
                item.officialInfoCutContent = item.officialInfoContent.length > 35 ? `${item.officialInfoContent.slice(0, 36)}...` : item.officialInfoContent
                item.officialInfoCutContent = textCut.cut({
                    key: '2',
                    text: item.officialInfoContent
                })
                item.createRelative = time.relative(item.create)
                item.createFull = time.full(item.create)
                
                // 额外添加官方名称
                // const dataOfficialDetail = await serviceOfficial.getOfficialDetail({
                //     officialId: item.officialId
                // })

                item.officialName = global.mapOfficial[item.officialId].officialName
                item.officialPic = global.mapOfficial[item.officialId].officialPic

                delete item._id
                delete item.officialInfoContent
                return item
            })
        }
        return _officialInfoList
    } catch(e) {
        console.error(e)
    }
    return undefined
}

exports.getInfo = async(options) => {
    const { officialInfoId } = options
    try {
        let dataOfficalItem = await daoOfficialInfo.get({
            _id: officialInfoId,
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            isShow: 0,
            isActive: 0,
            isDelete: 0
        })

        if(dataOfficalItem) {
            dataOfficalItem = dataOfficalItem[0]
            dataOfficalItem.officialInfoId = dataOfficalItem._id
            dataOfficalItem.createRelative = time.relative(dataOfficalItem.create)
            dataOfficalItem.createFull = time.full(dataOfficalItem.create)
            
            delete dataOfficalItem._id
    
            return dataOfficalItem
        }
        
    } catch(e) {
        console.error(e)
    }
    return undefined
}

exports.getOfficialAndOfficialInfoList = async(options) => {
    try {
        let dataOfficial = await daoOfficial.get({
            _id: options.officialId,
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            create: 1,
            officialName: 1,
            officialDes: 1,
            officialFullSupport: 1,
            officialFocus: 1,
            officialPic: 1
        })

        dataOfficial = dataOfficial[0]
        dataOfficial.officialId = dataOfficial._id
        delete dataOfficial._id
        
        let officialInfoList = await daoOfficialInfo.get({
            officialId: options.officialId,
            isShow: true,
            isActive: true,
            isDelete: false
        }, {
            isShow: 0,
            isActive: 0,
            isDelete: 0
        }, {
            create: -1
        })

        const _officialInfoList = loops.getNewArray(officialInfoList, (item) => {
            item.officialInfoId = item._id
            item.officialInfoCutContent = item.officialInfoContent.length > 35 ? `${item.officialInfoContent.slice(0, 36)}...` : item.officialInfoContent
            item.officialInfoCutContent = textCut.cut({
                key: '1',
                text: item.officialInfoContent
            })
            item.createRelative = time.relative(item.create)
            item.createFull = time.full(item.create)

            delete item._id
            delete item.officialInfoContent
            return item
        })
        dataOfficial.officialInfoCount = _officialInfoList.length

        return success({
            msg: 'getOfficialInfoList',
            data: {
                success: true,
                official: dataOfficial,
                officialInfoList: _officialInfoList
            }
        })
    } catch(e) {
        console.error(e)
    }
    return fail({
        msg: 'getOfficialInfoList',
        data: {
            success: false,
            official: {},
            officialInfoList: []
        }
    })
}

exports.getOfficialInfoList = async(options) => {
    const query = {
        isShow: true,
        isActive: true,
        isDelete: false
    }
    if(options.officialId) {
        query.officialId = options.officialId
    }
    let officialInfoList = await daoOfficialInfo.get(query, {
        pageSize: options.pageSize,
        page: options.page,
    }, {
        create: -1
    })
    console.log('officialInfoList', officialInfoList);
    let _officialInfoList = undefined
    if(officialInfoList) {
        _officialInfoList = loops.getAsyncNewArray(officialInfoList, async(item) => {
            item.officialInfoId = item._id
            item.officialInfoCutContent = item.officialInfoContent.length > 35 ? `${item.officialInfoContent.slice(0, 36)}...` : item.officialInfoContent
            item.officialInfoCutContent = textCut.cut({
                key: '2',
                text: item.officialInfoContent
            })
            item.createRelative = time.relative(item.create)
            item.createFull = time.full(item.create)
            
            // 额外添加官方名称
            // const dataOfficialDetail = await serviceOfficial.getOfficialDetail({
            //     officialId: item.officialId
            // })

            item.officialName = global.mapOfficial[item.officialId].officialName
            item.officialPic = global.mapOfficial[item.officialId].officialPic

            delete item._id
            delete item.officialInfoContent
            return item
        })
        return _officialInfoList
    }
    return undefined
}

exports.setDelete = async(options) => {
    let dataOfficialInfo = undefined
    // 获取合法用户 && 获取 officialId
    const dataUserInfo = await serviceOfficialUser.getUserInfo({
        wxSessionCode: options.wxSessionCode
    })
    
    if(dataUserInfo) {
        const query = {
            _id : options.officialInfoId.toString(),
            officialId : dataUserInfo.officialId,
        }
        const update = {
            $set: {
                isDelete: true
            }
        }
        dataOfficialInfo = await daoOfficialInfo.set(query, update, {})
        return dataOfficialInfo
    }
    return undefined
}

exports.setOfficialInfo = async(options) => {
    let dataOfficialInfo = undefined
    // 获取合法用户 && 获取 officialId
    const dataUserInfo = await serviceOfficialUser.getUserInfo({
        wxSessionCode: options.wxSessionCode
    })
    
    if(dataUserInfo) {
        const query = {
            _id : options.officialInfoId.toString(),
            officialId : dataUserInfo.officialId,
            isActive: true
        }
        const update = {
            $set: {
                officialInfoTitle: options.officialInfoTitle,
                officialInfoContent: options.officialInfoContent,
                update: Date.parse(new Date())
            }
        }
        dataOfficialInfo = await daoOfficialInfo.set(query, update, {})
        return {
            officialInfoId: dataOfficialInfo._id,
        }
    }
    return undefined
}

exports.addSupport = async(options) => {
    const query = {
        _id : options.officialInfoId,
        isShow: true,
        isDelete: false,
        isActive: true
    }
    const update = {
        $inc: {
            officialInfoSupport: 1
        }
    }
    const dataOfficialInfo = await daoOfficialInfo.set(query, update, {})
    return dataOfficialInfo
}

exports.addShare = async(options) => {
    const query = {
        _id : options.officialInfoId,
        isShow: true,
        isDelete: false,
        isActive: true
    }
    const update = {
        $inc: {
            officialInfoShare: 1
        }
    }
    const dataOfficialInfo = await daoOfficialInfo.set(query, update, {})
    return dataOfficialInfo
}

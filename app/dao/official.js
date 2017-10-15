/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:06:07 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-13 03:37:27
 */

const mongo = require('mongodb')
const connect = require('./lib/connect')
const ObjectID = mongo.ObjectID
const mongoClient = mongo.MongoClient
const log = require('../../config/log4js')

// exports.created = async (options) => {
//     const db = await connect()
//     let icoList = []
//     options.create = Date.parse(new Date())
//     try {
//         icoList = await db.collection('official').insert(options)
//         await db.collection('official').ensureIndex({
//             circleName: 1,
//             isShow: 1,
//             isActive: 1
//         }, {
//             unique: true, 
//             background: true, 
//             dropDups: true
//         })
//     } catch(e) {
//         log.db.error(`tableName: official; function: created; info: ${e};`)
//         console.error(e)
//     }
//     db.close()
//     return icoList
// }

exports.get = async (options = {}, projection = {}, sort = {}) => {
    const db = await connect()
    let official = {}
    let pageTotal = 0
    if(options._id) {
        options._id = new ObjectID(options._id)
    }

    const page = Number(projection.page)
    const pageSize = Number(projection.pageSize)
    delete projection.page
    delete projection.pageSize
    try {
        official = await db.collection('official').find(options, projection).skip((page - 1) * pageSize).limit(pageSize).sort(sort).toArray();
        pageTotal = await db.collection('official').find({hasDelete: false}).count();
    } catch(e) {
        log.db.error(`tableName: official; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    let pagination = {
        page: page,
        pageSize: pageSize,
        pageTotal: pageTotal
    }
    return official
}

exports.getCount = async (options) => {
    const db = await connect()
    let officialCount = 0
    try {
        officialCount = await db.collection('official').find(options).count()
    } catch(e) {
        log.db.error(`tableName: official; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    return officialCount
}
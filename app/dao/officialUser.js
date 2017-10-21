/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:06:07 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-21 16:39:11
 */

const mongo = require('mongodb');
const connect = require('./lib/connect')
const ObjectID = mongo.ObjectID;
const mongoClient = mongo.MongoClient;
const log = require('../../config/log4js')

exports.create = async (save) => {
    const db = await connect()
    let dataOfficialUser = undefined
    try {
        save.create = Date.parse(new Date())
        // await db.collection('officialUser').ensureIndex({
        //     openId: 1,
        //     isActive: 1
        // }, {
        //     unique: true, 
        //     background: true, 
        //     dropDups: true
        // })
        dataOfficialUser = await db.collection('officialUser').insert(save)
        dataOfficialUser = dataOfficialUser.ops[0]
    } catch(e) {
        log.db.error(`tableName: officialUser; function: created; info: ${e};`)
        console.error(e)
    }
    db.close()    
    return dataOfficialUser
}

exports.get = async (options = {}, projection = {}, sort = {}) => {
    const db = await connect()
    let officialUser = undefined
    let pageTotal = 0

    if(options._id) {
        options._id = new ObjectID(options._id)
    }

    const page = Number(projection.page)
    const pageSize = Number(projection.pageSize)

    delete projection.page
    delete projection.pageSize

    try {
        officialUser = await db.collection('officialUser').find(options, projection).skip((page - 1) * pageSize).limit(pageSize).sort(sort).toArray();
        // pageTotal = await db.collection('officialUser').find({hasDelete: false}).count();
    } catch(e) {
        log.db.error(`tableName: officialUser; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    // let pagination = {
    //     page: page,
    //     pageSize: pageSize,
    //     pageTotal: pageTotal
    // }
    return officialUser
}

// exports.set = async ((query = {}, update = {}, config = {}) => {
//     const db = await connect()
//     let dataOfficialUser = {}
//     try {
//         let dataOfficialUser = await db.collection('officialUser').findOne({ openId: options.openId })
//         if(dataOfficialUser) {
//             dataOfficialUser = Object.assign({}, dataOfficialUser, options)
//             await db.collection('officialUser').save(dataOfficialUser)
//         } else {
//             options.createTime = Date.parse(new Date())
//             await db.collection('officialUser').ensureIndex({
//                 openId: 1,
//                 isActive: 1
//             }, {
//                 unique: true, 
//                 background: true, 
//                 dropDups: true
//             })
//             dataOfficialUser = await db.collection('officialUser').insert(options)
//             dataOfficialUser = dataOfficialUser.ops[0]
//         }
//     } catch(e) {
//         log.db.error(`tableName: officialUser; function: created; info: ${e};`)
//         console.error(e)
//     }
//     db.close()    
//     return dataOfficialUser
// })

exports.set = async (query = {}, update = {}, config = {}) => {
    const db = await connect()
    let dataUpdate = undefined
    try {
        if(query._id) {
            query._id = new ObjectID(query._id)
        }
        // collection.findAndModify(query, sort, update, options, callback)
        dataUpdate = await db.collection('officialUser').findAndModify(
            query,
            [['_id', 'asc']],
            update,
            {
                remove: false,
                new: true
            }
        )
    } catch(e) {
        log.db.error(`tableName: officialUser; function: get; info: ${e}`)
        console.error(e)
    }
    // n: 1, nModified: 0, ok: 1
    // n 表示找到条数  nModified 表示修改条数 ok 表示操作状态
    db.close()
    if(dataUpdate.n === 0) {
        return undefined
    } else {
        return dataUpdate.value
    }
}
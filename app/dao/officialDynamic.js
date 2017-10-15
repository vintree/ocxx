/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:06:07 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-13 23:59:27
 */

const mongo = require('mongodb');
const connect = require('./lib/connect')
const ObjectID = mongo.ObjectID;
const mongoClient = mongo.MongoClient;
const log = require('../../config/log4js')

exports.create = async (save) => {
    const db = await connect()
    let dbData = []
    save.create = Date.parse(new Date())
    try {
        dbData = await db.collection('officialDynamic').insert(save)
        await db.collection('officialDynamic').ensureIndex({
            userId: 1,
            officialId: 1,
            officialInfoId: 1,
            typeCode: 1
        }, {
            unique: true, 
            background: true, 
            dropDups: true
        })
    } catch(e) {
        log.db.error(`tableName: officialDynamic; function: created; info: ${e};`)
        console.error(e)
    }
    db.close()
    return dbData.ops
}

exports.get = async (options = {}, projection = {}, sort = {}) => {
    const db = await connect()
    let officialDynamic = undefined
    let pageTotal = 0
    if(options._id) {
        options._id = new ObjectID(options._id)
    }

    const page = Number(projection.page)
    const pageSize = Number(projection.pageSize)

    delete projection.page
    delete projection.pageSize
    try {
        officialDynamic = await db.collection('officialDynamic').find(options, projection).skip((page - 1) * pageSize).limit(pageSize).sort(sort).toArray();
        // pageTotal = await db.collection('officialDynamic').find({hasDelete: false}).count();
    } catch(e) {
        log.db.error(`tableName: officialDynamic; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    // let pagination = {
    //     page: page,
    //     pageSize: pageSize,
    //     pageTotal: pageTotal
    // }
    return officialDynamic
}

exports.getCount = async (options) => {
    const db = await connect()
    let officialCount = 0
    try {
        officialCount = await db.collection('officialDynamic').find(options).count()
    } catch(e) {
        log.db.error(`tableName: officialDynamic; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    return officialCount
}


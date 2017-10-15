/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:06:07 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-09-03 15:05:06
 */

const mongo = require('mongodb');
const connect = require('./lib/connect')
const ObjectID = mongo.ObjectID;
const mongoClient = mongo.MongoClient;
const log = require('../../config/log4js')

exports.created = async (options) => {
    const db = await connect()
    let icoList = []
    options.createTime = Date.parse(new Date())
    try {
        icoList = await db.collection('ico').insert(options)
        await db.collection('ico').ensureIndex({
            icoName: 1,
            isDel: 1
        }, {
            unique: true, 
            background: true, 
            dropDups: true
        })
    } catch(e) {
        log.db.error(`tableName: ico; function: created; info: ${e};`)
        console.error(e)
    }
    db.close()
    return icoList
}

exports.get = async (options = {}, projection = {}, sort = {}) => {
    const db = await connect()
    let ico = {}
    
    let pageTotal = 0
    if(options._id) {
        options._id = new ObjectID(options._id)
    }

    const page = Number(projection.page)
    const pageSize = Number(projection.pageSize)

    delete projection.page
    delete projection.pageSize

    try {
        ico = await db.collection('ico').find(options, projection).skip((page - 1) * pageSize).limit(pageSize).sort(sort).toArray();
        pageTotal = await db.collection('ico').find({hasDelete: false}).count();
    } catch(e) {
        log.db.error(`tableName: ico; function: get; info: ${e}`)
        console.error(e);
    }
    db.close()
    let pagination = {
        page: page,
        pageSize: pageSize,
        pageTotal: pageTotal
    }
    return ico
    // return {
    //     icoList: ico,
    //     pagination
    // }
}
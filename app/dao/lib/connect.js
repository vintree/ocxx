const mongo = require('mongodb')
const ObjectID = mongo.ObjectID
const mongoClient = mongo.MongoClient
const log = require('../../../config/log4js')
const {
    mongodb
} = require('../../../config/config.default')

module.exports = async (app) => {
    try {
        let db = await mongoClient.connect(mongodb);
        console.log('=======database is connect=======');
        return db;
    } catch(e) {
        log.db.error(`connect; info: ${e}`)
        console.error(e)
    }
}
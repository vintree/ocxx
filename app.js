/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:02:49 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-23 00:10:11
 */
const startTime = new Date()

const Koa = require('koa')
const app = new Koa()
const router = require('./app/router.js')
const jsonp = require('koa-jsonp')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')

const fs = require('fs')
const logger = require('koa-logger')
const log = require('./config/log4js')
// const schedule = require('./app/service/schedule/schedule')
let config = {}

if( process.env.NODE_ENV === 'production' ) { 
    config = require('./config/config.local.js')
} else if( process.env.NODE_ENV === 'development' ) {
    config = require('./config/config.default.js')
    // console.log("Server started and listen on port 127.0.0.1:" + config.port);
}
global.config = config

app.use(jsonp())
app.use(router())
// 文件上传，注意书写的位置很重要，否则无法上传
app.use(koaBody({ multipart: true }))
// 解析请求体
app.use(bodyParser())

process.env.NODE_ENV !== 'development' && app.use(logger())
// 日志
log.system.info(((ms) => `Server startup in ${ms} ms, Address: http://127.0.0.1:${config.port}`)(Date.now() - startTime));
//bind exception event to log
process.on('uncaughtException', function (e) {
    log.system.error('uncaughtException from process', e);
});
process.on('unhandledRejection', (e) => {
    log.system.warn('unhandledRejection from process', e);
});
process.on('rejectionHandled', (e) => {
    log.system.warn('rejectionHandled from process', e);
});

app.listen(config.port);

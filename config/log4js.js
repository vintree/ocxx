/*
 * @Author: puxiao.wh 
 * @Date: 2017-09-01 00:07:41 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-09-01 01:50:45
 */

'use strict';

var log4js = function () {
    const log4js = require('log4js')
    const fs = require('fs')
    const path = require('path')
    
    // trace debug  info  warn  error  fatal //
    const logPath = require('./config').logPath;

    var appenders = [
        {
            type: 'console'
        },
        {
            type: 'dateFile',
            filename: path.resolve(logPath, 'db.log'),
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true, // 文件名是否始终包含占位符
            category: 'db', //db操作时打印的日志
            level: 'ALL'
        },
        {
            type: 'dateFile',
            filename: path.resolve(logPath, 'action.log'),
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            category: 'action', //用户操作记录
            level: 'ALL'
        },
        {
            type: 'dateFile',
            filename: path.resolve(logPath, 'system.log'),
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            category: 'system', //系统问题
            level: 'ALL'
        },
        {
            type: 'dateFile',
            filename: path.resolve(logPath, 'request.log'),
            pattern: '-yyyy-MM-dd',
            alwaysIncludePattern: true,
            category: 'request', //请求
            level: 'ALL'
        },
    ];

    log4js.configure({
        appenders: appenders
    });

    var logger_export = {};

    appenders.forEach(function (appender) {
        let name = appender.category;
        if (name) {
            let logger = log4js.getLogger(name);
            logger_export[name] = logger;
            logger.setLevel(appender.level || 'ALL');
        }
    });

    return logger_export;
    
}();

global.log = log4js;
module.exports = log4js;
const schedule = require('node-schedule')
const site = require('./site')
const log = require('../../../config/log4js')
const notice = require('./notice')

async function first() {    
    var rule = new schedule.RecurrenceRule()
    rule.hour = 11
    rule.minute = 45
    rule.second = 54
    var j = schedule.scheduleJob(rule, async () => {
        console.log('现在时间：',new Date())
        log.action.info('Schedule task: bizhongchou')
        await site.bizhongchou()
        await site.ico365()
    });
}

async function second() {
    var rule = new schedule.RecurrenceRule()
    rule.hour = 17
    rule.minute = 45
    rule.second = 55
    var j = schedule.scheduleJob(rule, async () => {
        console.log('现在时间：',new Date())
        log.action.info('Schedule task: bizhongchou')        
        await site.bizhongchou()
        await site.ico365()
    });
}

async function noticeHuoBi() {
    var rule = new schedule.RecurrenceRule();
    rule.minute = 8;
    var j = schedule.scheduleJob(rule, function(){
        console.log('现在时间：',new Date())
        log.action.info('Schedule task: bizhongchou')
        notice.huoBi()
    })
}

exports.init = async () => {
    await first()
    await second()

    await noticeHuoBi()

    await notice.okcoin()
    // site.ico365()
}
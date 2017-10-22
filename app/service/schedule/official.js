const schedule = require('node-schedule')
const site = require('./site')
const log = require('../../../config/log4js')
const notice = require('./notice')
const serviceOfficial = require('../official')
const serviceOfficialDynamic = require('../officialDynamic')
const loops = require('../../utils/loops')

async function syncOfficialFocus() {
    var rule = new schedule.RecurrenceRule()
    rule.hour = 03
    rule.minute = 45
    rule.second = 54
    var j = schedule.scheduleJob(rule, async () => {
        console.log('现在时间：',new Date())
        log.action.info('Schedule task: async official')

        // 获取官方列表
        const dataServiceOfficial = await serviceOfficial.getPureOfficialList()
        // 获取官方Ids
        const dataServiceOfficialIds = await loops.getNewArray(dataServiceOfficial, async(item) => {
            console.log('sssddd', item._id);
            // 同步关注
            const dataOfficialFocusCount = await serviceOfficialDynamic.getOfficialFocusCount({
                officialId: item._id
            })
            console.log('dataOfficialFocusCount', dataOfficialFocusCount);
            // // 同步赞同
            const dataOfficialSupportCount = await serviceOfficialDynamic.getOfficialSupportCount({
                officialId: item._id
            })
            console.log('dataOfficialSupportCount', dataOfficialSupportCount);
            // // 同步分享
            const dataOfficialShareCount = await serviceOfficialDynamic.getOfficialShareCount({
                officialId: item._id
            })
            console.log('dataOfficialShareCount', dataOfficialShareCount);

            const dataOfficial = await serviceOfficial.setOfficialInfo({
                officialId: item._id,
                officialFullSupport: dataOfficialSupportCount,
                officialFullShare: dataOfficialShareCount,
                officialFocus: dataOfficialFocusCount
            })
        })
    })
}

// async function second() {
//     var rule = new schedule.RecurrenceRule()
//     rule.hour = 17
//     rule.minute = 45
//     rule.second = 55
//     var j = schedule.scheduleJob(rule, async () => {
//         console.log('现在时间：',new Date())
//         log.action.info('Schedule task: bizhongchou')        
//         await site.bizhongchou()
//         await site.ico365()
//     });
// }

// async function noticeHuoBi() {
//     var rule = new schedule.RecurrenceRule();
//     rule.minute = 8;
//     var j = schedule.scheduleJob(rule, function(){
//         console.log('现在时间：',new Date())
//         log.action.info('Schedule task: bizhongchou')
//         notice.huoBi()
//     })
// }

exports.init = async () => {
    syncOfficialFocus()
}
/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-09-03 14:17:52
 */

const cheerio = require('cheerio')
const daoico = require('./../dao/ico');
const _ = require('../utils/request')
const scheduleSite = require('./schedule/site')

// async function bizhongchouRequest(url) {
//     const text = await _.text(url)
//     const $ = cheerio.load(text)
//     const listDom = $('#list_content_all').children('li')

//     listDom.each(async function(item) {
//         const doms = $(this)
//         const infoDom = doms.find('.progress-news').children()

//         const icoName = doms.find('.activity-name').children('a').text().trim()
//         const icoImgUrl = doms.find('img').attr('src')
//         const icoDes = doms.find('.library-list-desc').text().trim()
//         const icoTargetAmount = infoDom.eq(0).find('a').text().trim()
//         const icoStarTime = infoDom.eq(1).find('a').text().trim()
//         let icoState = doms.find('.ico-list-state-before, .ico-list-state-after').text().trim()

//         switch(icoState) {
//             case '预热中':
//                 icoState = 'THE'
//                 break
//             case '已完成':
//                 icoState = 'FINISH'
//                 break
//             case '进行中':
//                 icoState = 'ING'
//                 break
//         }

//         const detailLink = `http://bizhongchou.com${infoDom.eq(0).find('a').attr('href')}`
//         const icoSource = '币众筹'
        
//         const detailText = await _.text(detailLink)
//         const $1 = cheerio.load(detailText)
//         const icoDetail = $1('.l_main').html()
//         const icoSiteLink = $1('.shoucang_span').children('a').attr('href')

//         daoico.created({
//             icoName,
//             icoImgUrl,
//             icoDes,
//             icoTargetAmount,
//             icoStarTime,
//             icoState,
//             icoSource,
//             icoDetail,
//             detailLink,
//             icoSiteLink,
//             isDel: false
//         })
//     })
//     return listDom.length
// }




// exports.bizhongchou = async () => {
//     let count = 1
//     while(count !== 0) {
//         const listCount = await scheduleSite.bizhongchouRequest(`https://bizhongchou.com/project_ico/r--id-0-loc--state-0-tag--k--type-0-p-${count}.html`)
//         if(listCount > 0) {
//             count++
//         } else {
//             count = 0
//             break
//         }
//     }
// }


function reconvert(str) {
    str = str.replace(/(\\u)(\w{4})/gi,function($0) { 
    return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g,"$2")),16))); }); str = str.replace(/(&#x)(\w{4});/gi,function($0){ return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g,"$2"),16)); }); return str; 
}

exports.getIcoDetail = async (options) => {
    const seletOptions = {
        _id: options._id,
        isDel: false
    }
    const projection = {
        icoDetail: 1,
        icoSiteLink: 1
    }

    let ico = await daoico.get(seletOptions, projection)
    ico = ico[0]
    let icoDetail = ico.icoDetail
    icoDetail = icoDetail.replace(/&#xA0;/g, '')
    icoDetail = reconvert(icoDetail)
    ico.icoDetail = icoDetail

    return ico
}
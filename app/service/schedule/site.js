/*
 * @Author: puxiao.wh 
 * @Date: 2017-08-31 02:43:00 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-09-03 16:04:30
 */

/**
 * 币众筹
 */
const cheerio = require('cheerio')
const daoico = require('../../dao/ico')
const _ = require('../../utils/request')

async function bizhongchouRequest(url) {
    const text = await _.text(url)
    const $ = cheerio.load(text)
    const listDom = $('#list_content_all').children('li')
    const icoSourceCode = 'bzc'

    listDom.each(async function(item) {
        const doms = $(this)
        const infoDom = doms.find('.progress-news').children()

        const icoName = doms.find('.activity-name').children('a').text().trim()
        const icoImgUrl = doms.find('img').attr('src')
        const icoDes = doms.find('.library-list-desc').text().trim()
        const icoTargetAmount = infoDom.eq(0).find('a').text().trim()
        const icoStarTime = infoDom.eq(1).find('a').text().trim()
        let icoState = doms.find('.ico-list-state-before, .ico-list-state-after').text().trim()

        switch(icoState) {
            case '预热中':
                icoState = 'THE'
                break
            case '已完成':
                icoState = 'FINISH'
                break
            case '进行中':
                icoState = 'ING'
                break
        }
        const icoDetailLink = `http://bizhongchou.com${infoDom.eq(0).find('a').attr('href')}`
        const icoSource = '币众筹'
        
        // 查询是否已经记录过ico
        const icoList = await daoico.get({
            icoName,
            icoSourceCode
        }, {
            icoName: 1
        })

        if(icoList.length === 0) {
            const detailText = await _.text(icoDetailLink)
            const $1 = cheerio.load(detailText)
            const icoDetail = $1('.l_main').html()
            const icoSiteLink = $1('.shoucang_span').children('a').attr('href')
    
            daoico.created({
                icoName,
                icoImgUrl,
                icoDes,
                icoTargetType: undefined,
                icoTargetAmount,
                icoStarTime,
                icoState,
                icoSource,
                icoDetail,
                icoDetailLink,
                icoSiteLink,
                icoSourceCode,
                icoPlatformLink: 'https://bizhongchou.com/project_ico.html',
                isDel: false
            })
        }

    })
    return listDom.length
}

// 币众筹
exports.bizhongchou = async () => {
    let count = 1
    while(count !== 0) {
        const listCount = await bizhongchouRequest(`https://bizhongchou.com/project_ico/r--id-0-loc--state-0-tag--k--type-0-p-${count}.html`)
        if(listCount > 0) {
            count++
        } else {
            count = 0
            break
        }
    }
}

// ico365
exports.ico365 = async (options = {curnum: 0, addnum: 20}) => {
    const { curnum, addnum } = options
    const url = 'https://www.ico365.com/api/itemlist'
    const params = {
        type: 'all',
        curnum,
        addnum
    }
    const icoSourceCode = 'ico365'
    let ico365Data = await _.get(url, params)
    let ico365List = []

    if(ico365Data.success) {
        ico365List = ico365Data.data.item_list
    }

    ico365List.forEach(async function(data) {
        const icoName = data.item_theme
        const _icoStates = ['THE', 'ING', 'FINISH']
        const icoState = _icoStates[data.item_state - 1]
        // 查询是否已经记录过ico
        const icoList = await daoico.get({
            icoName,
            icoSourceCode
        }, {
            icoName: 1
        })

        if(icoList.length === 0) {
            daoico.created({
                icoName,
                icoImgUrl: data.pic_url,
                icoDes: data.item_describe,
                icoTargetType: data.target_money_curtype_state,
                icoTargetAmount: data.sum_money_currency,
                icoStarTime: data.item_start_time,
                icoState,
                icoSource: 'ico356',
                icoSourceCode,
                icoDetail: undefined,
                icoDetailLink: undefined,
                icoSiteLink: undefined,
                icoPlatformLink: 'https://www.ico365.com/items',
                isDel: false
            })
        }
    })

    if(ico365List.length !== 0) {
        await exports.ico365({
            curnum: curnum + addnum,
            addnum: addnum
        })
    }
}
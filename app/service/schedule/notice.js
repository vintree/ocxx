/*
 * @Author: puxiao.wh 
 * @Date: 2017-08-31 02:43:00 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-13 01:01:17
 */

/**
 * 火币
 */
const cheerio = require('cheerio')
const daoNotice = require('../../dao/notice')
const _ = require('../../utils/request')

// 火币
exports.huoBi = async (count = 1) => {
    const url = `https://www.huobi.com/p/content/notice?page=${count}`
    const text = await _.text(url)
    const $ = cheerio.load(text)
    const listDom = $('.notice').children('li')
    const noticeSourceCode = 'hb'
    const noticeSource = '火币网'
    let isGoOn = []
    
    for(let i = 0, l = listDom.length; i < l; i++) {
        const doms = listDom.eq(i)
        const noticeTit = doms.find('.tit')
        
        const noticeName = noticeTit.children('a').text()
        // 查询是否已经记录过
        const noticeList = await daoNotice.get({
            noticeName,
            noticeSourceCode
        }, {
            noticeName: 1
        })

        if(noticeList.length === 0) {
            const noticeDes = doms.find('.news').text()
            const noticeDetailLink = `https://www.huobi.com${noticeTit.children('a').attr('href')}`
            const noticeCreateTime = Date.parse(new Date(doms.find('.news').next().text()))
            const noticeState = 'official'

            const detailText = await _.text(noticeDetailLink)
            const $1 = cheerio.load(detailText)
            const noticeDetailHtml = $1('.notice').html()
            
            await daoNotice.created({
                noticeName,
                noticeDes,
                noticeState,
                noticeDetailHtml,
                noticeDetailLink,
                noticeCreateTime,
                noticeSourceCode,
                noticeSource,
                isDel: false
            })
        }
    }
    
    if(listDom.length !== 0) {
        await exports.huobi(count + 1)
    }
}

// 火币
exports.okcoin = async (count = 1) => {
    const url = `https://www.okcoin.cn/tcat-1-101-${count}.html`
    const text = await _.text(url)
    const $ = cheerio.load(text)
    const listDom = $('.theme_list')
    const noticeSourceCode = 'OKCoin'
    const noticeSource = 'OKCoin'
    let isGoOn = []
    

    for(let i = 0, l = listDom.length; i < l; i++) {
        const doms = listDom.eq(i)
        const noticeTit = doms.find('.title_name')
        
        const noticeName = noticeTit.text()
        // 查询是否已经记录过
        const noticeList = await daoNotice.get({
            noticeName,
            noticeSourceCode
        }, {
            noticeName: 1
        })

        if(noticeList.length === 0) {
            const noticeDes = ''
            const noticeDetailLink = `https://www.okcoin.cn${noticeTit.attr('href')}`
            const noticeCreateTime = Date.parse(new Date(doms.find('.time').text()))
            const noticeState = 'official'

            const detailText = await _.text(noticeDetailLink)
            const $1 = cheerio.load(detailText)
            const noticeDetailHtml = $1('.invitation_con').html()
            
            // console.log(noticeName, noticeDes, noticeState, noticeDetailLink, noticeCreateTime, );

            // await daoNotice.created({
            //     noticeName,
            //     noticeDes,
            //     noticeState,
            //     noticeDetailHtml,
            //     noticeDetailLink,
            //     noticeCreateTime,
            //     noticeSourceCode,
            //     noticeSource,
            //     isDel: false
            // })
        }
    }
    
    if(listDom.length !== 0) {
        await exports.huobi(count + 1)
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
        const noticeName = data.item_theme
        const _icoStates = ['THE', 'ING', 'FINISH']
        const icoState = _icoStates[data.item_state - 1]
        // 查询是否已经记录过ico
        const noticeList = await daoNotice.get({
            noticeName,
            icoSourceCode
        }, {
            noticeName: 1
        })

        if(noticeList.length === 0) {
            daoNotice.created({
                noticeName,
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
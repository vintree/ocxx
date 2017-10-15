/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-09 17:08:42
 */
const asyncHooks = require('async_hooks')
const cheerio = require('cheerio')
const _ = require('../utils/request')
const serviceico = require('../service/ico')
const daoico = require('../dao/ico')
// const daoCircle = require('../dao/circle')
const log = require('../../config/log4js')
const {
    getOpenIdAndSeesionKey
} = require('../service/wx/util')


const uploadOfficialPic = async (ctx, next) => {
    const { req, res } = ctx
    const { code } = ctx.req.body
    const wxData = await getOpenIdAndSeesionKey(code)
    const sessionKey = wxData.sessionKey
    const openId = wxData.openId
    // console.log(ctx.req.file.filename);
    // console.log('sssss', wxData);
}

var getIcoList = async (ctx, next) => {
    const startTime = new Date()
    const seletOptions = {
        isDel: false,
        icoState: ctx.query.icoState || ''
    }
    const projection = {
        page: ctx.query.page || '1',
        pageSize: ctx.query.pageSize || '10',
        _id: 1,
        icoName: 1,
        icoImgUrl: 1,
        icoDes: 1,
        icoTargetAmount: 1,
        icoStarTime: 1,
        icoState: 1,
        icoSource: 1,
        icoTargetType: 1,
        icoSourceCode: 1,
        icoSiteLink: 1,
        icoDetailLink: 1,
        icoPlatformLink: 1
    }
    let pageCount = 0
    const icoList = await daoico.get(seletOptions, projection, {icoStarTime: -1})

    log.action.info(((ms) => `action startup in ${ms} ms, Address: /rest/ico/getIcoList`)(Date.now() - startTime))
    ctx.response.type ='application/json'
    ctx.response.body = {
        code: 200,
        data: {
            icoList: icoList,
            success: true
        },
        success: true
    }
}

var getIcoDetail = async (ctx, next) => {
    const startTime = new Date()
    console.log('query', ctx.query);
    const icoDetail = await serviceico.getIcoDetail({
        _id: ctx.query.icoId
    })

    log.action.info(((ms) => `action startup in ${ms} ms, Address: /rest/ico/getIcoDetail`)(Date.now() - startTime))    
    ctx.response.type ='application/json'
    ctx.response.body = {
        code: 200,
        data: {
            ico: icoDetail,
            success: true
        },
        success: true
    }
}

module.exports = {
    // 'GET /rest/ico/autoRefreshIco': autoRefreshIco,
    'POST /rest/official/uploadOfficialPic': uploadOfficialPic,
    'GET /rest/ico/getIcoDetail': getIcoDetail,
    // 'POST /saveUserinfo': saveUserinfo
};
/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:36 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-14 17:45:59
 */

const _ = require('../utils/request')
const daoCircle = require('../dao/officialCircle')
const serviceOfficialCircle = require('../service/officialCircle')
const log = require('../../config/log4js')
const { success, fail } = require('../utils/returnUtil')

const createCircle = async (ctx, next) => {
    const sss = {
        circleName: '圈子名称',
        circleNameEN: '圈子英文名称',
        circleImg: undefined,
        isShow: true,
        isActive: true
    }
    daoCircle.created(sss)
}

const getCirleOfficialList = async (ctx, next) => {
    const officialListData = await serviceOfficialCircle.getCirleOfficialList({
        circleId: ctx.query.circleId
    })
    if(officialListData.code === 200) {
        ctx.response.type ='application/json'
        ctx.response.body = Object.assign(officialListData, {
            success: true
        })
    }
}

const getListAndOfficialCount = async (ctx, next) => {
    const dataCircleListAndOfficialCountawait = await serviceOfficialCircle.getCircleListAndOfficialCount()
    if(dataCircleListAndOfficialCountawait) {
        ctx.response.type ='application/json'
        ctx.response.body = success({
            msg: 'getCircleListAndOfficialCount',
            data: {
                circleList: dataCircleListAndOfficialCountawait || []
            }
        })
    }
}

module.exports = {
    // 'GET /rest/official/createCircle': createCircle,
    'GET /rest/official/circle/getListAndOfficialCount': getListAndOfficialCount,
    // 'GET /rest/official/getCirleOfficialList': getCirleOfficialList,
};
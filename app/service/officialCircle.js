/*
 * @Author: puxiao.wh 
 * @Date: 2017-07-23 17:05:52 
 * @Last Modified by: puxiao.wh
 * @Last Modified time: 2017-10-15 20:30:02
 */

const {
    success,
    fail
} = require('../utils/returnUtil')
const daoOfficialCircle = require('../dao/officialCircle')
const daoOfficial = require('../dao/official')
const daoOfficialInfo = require('../dao/officialInfo')

exports.getCircleListAndOfficialCount = async() => {
    let circleList = await daoOfficialCircle.get({})
    try {
        const _circleList = []
        for(let i = 0, l = circleList.length; i < l; i++) {
            const circleData = circleList[i]
            const officialCount = await daoOfficial.getCount({
                circleId: circleData._id.toString(),
                isShow: true,
                isActive: true
            })
            circleData.officialCount = officialCount
            _circleList.push({
                officialCount,
                circleId: circleData._id,
                circleName: circleData.circleName || '未定义',
                circleNameEN: circleData.circleNameEN || 'Undefined',
                circlePic: circleData.circlePic || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1507578056394&di=078ff49234a09f8e2f6923e28e90e7df&imgtype=0&src=http%3A%2F%2Fimage.bitautoimg.com%2Ftaoche%2F2016_pc_usedcar%2Ffail_150_150.png'
            })
        }
        return _circleList
        
        // await success({
        //     msg: 'getCircleListAndOfficialCount',
        //     data: {
        //         success: true,
        //         circleList: _circleList
        //     }
        // })
    } catch(e) {
        console.error(e)
    }
    return undefined
    // fail({
    //     msg: 'getCircleListAndOfficialCount',
    //     data: {}
    // })
}

exports.getCirleOfficialList = async(options) => {
    try {
        let officialList = await daoOfficial.get({
            circleId: options.circleId,
            isShow: true,
            isActive: true
        }, {
            create: 1,
            officialName: 1,
            officialDes: 1,
            officialFullSupport: 1,
            officialFocus: 1,
            officialPic: 1
        })
        const _officialList = []
        for(let i = 0, l = officialList.length; i < l; i++) {
            const officialData = officialList[i]
            // 文章数
            // const officialInfoCount = await daoOfficial.getCount({
            //     officialId: officialData._id.toString(),
            //     isShow: true,
            //     isActive: true
            // })

            let officialInfoCount = await daoOfficialInfo.getCount({
                officialId: officialData._id,
                isShow: true,
                isActive: true
            })

            officialData.officialInfoCount = officialInfoCount
            officialData.officialId = officialData._id
            delete officialData._id
            _officialList.push(officialData)
        }
        return await success({
            msg: 'getOfficialList',
            data: {
                success: true,
                officialList: _officialList
            }
        })
    } catch(e) {
        console.error(e)
    }
    return fail({
        msg: 'getOfficialList',
        data: {
            success: false,
            officialList: []
        }
    })
}
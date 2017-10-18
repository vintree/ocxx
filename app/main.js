const serviceOfficial = require('./service/official')

exports.setMapOfficialList = async() => {
    const dataMapOfficialList = await serviceOfficial.getMapOfficialList()
    const mapOfficial = {}
    for(let i = 0, l = dataMapOfficialList.length; i < l; i++) {
        const dataMapOfficialItem = dataMapOfficialList[i]
        mapOfficial[dataMapOfficialItem.officialId] = dataMapOfficialItem
    }

    console.log('已添加数据之内存 global.mapOfficial = ', mapOfficial);
    global.mapOfficial = mapOfficial
}

exports.updateMapOfficialList = (options) => {
    const mapOfficial = global.mapOfficial
    global.mapOfficial = {
        ...mapOfficial,
        options
    }
}
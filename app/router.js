const fs = require('fs');
const router = require('koa-router')();
// const _ = require('../app/utils/request')
const main = require('./main')

function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            if(url.indexOf('upload') === -1) {
                router.post(path, mapping[url]);
                console.log(`register URL mapping: POST ${path}`);
            } else {
                const { uploadFile } = require('../app/service/upload')
                //路由  
                router.post(path, uploadFile().single('file'), mapping[url]);
                console.log(`register URL mapping: upload POST ${path}`);
            }
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, mapping[url]);
            console.log(`register URL mapping: PUT ${path}`);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(router, mapping);
    });
}

module.exports = function (dir) {
    var controllersDir = dir || 'controller';
    addControllers(router, controllersDir);

    // 官方数据放置内存
    // main.setMapOfficialList()

    return router.routes();
};
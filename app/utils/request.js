const urlx = require('urlx')
const fetch = require('node-fetch')
const log = require('../../config/log4js')

async function getCommon(url, params = {}) {
    try {
        if(!!params) {
            url = `${url}${urlx.stringify(params)}`
        }
        const res = await fetch(url)
        log.request.info(`url: ${url}; params: ${JSON.stringify(params)}; `)
        return res
    } catch(e) {
        log.request.error(`url: ${url}; params: ${JSON.stringify(params)}; info: ${e};`)
        console.error(e);
    }
}

async function postCommon(url = '', params = {}) {
    console.log('url', url);
    try {
        const res = await fetch(url, {
            method: 'POST', 
            body: JSON.stringify({
                scene: '111',
                path: '/page/index/index',
                width: 200
            }),
        })
        log.request.info(`url: ${url}; params: ${JSON.stringify(params)}; `)
        return res
    } catch(e) {
        log.request.error(`url: ${url}; params: ${JSON.stringify(params)}; info: ${e};`)
        console.error(e);
    }
}

exports.get = async(url, params) => {
    const body = await getCommon(url, params)
    const json = await body.json()
    return json
}

exports.text = async(url, params) => {
    const body = await getCommon(url, params)
    const text = await body.text()
    return text
}

exports.postText = async(url, params) => {
    const body = await postCommon(url, params)
    const text = await body.text()
    return text
}

exports.post = async(url, params) => {
    const body = await postCommon(url, params)
    const json = await body.json()
    return json
}
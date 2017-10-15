exports.success = (options) => {
    const { msg, data } = options
    return {
        data,
        code: 200,
        msg: `${msg}:ok`
    }
}

exports.fail = (options) => {
    const { msg, data } = options
    return {
        data: data || {},
        code: 400,
        msg: `${msg}:no`        
    }
}
const test = (ctx, next) => {
    ctx.response.type ='application/json';
    ctx.response.body = {
        code: 200,
        data: {
            success: true
        },
        success: true
    };
}

module.exports = {
    'GET /rest/test': test,
};
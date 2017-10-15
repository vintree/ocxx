if( process.env.NODE_ENV === 'production' ) { 
    const config = require('./config.local.js')
    module.exports = config
} else if( process.env.NODE_ENV === 'development' ) {
    const config = require('./config.default.js')
    module.exports = config
}
const crypto = require('crypto');

const algorithm = 'aes192'
const key = '231ds_dwq21_ew211_ewq23_vm93c'

//加密
exports.cipher = function(str = '') {
    var encrypted = "";
    var cip = crypto.createCipher(algorithm, key)
    encrypted += cip.update(str, 'utf8', 'hex')
    encrypted += cip.final('hex')
    return encrypted
};

//解密
exports.decipher = function(str = '') {
    var decrypted = "";
    var decipher = crypto.createDecipher(algorithm, key);
    decrypted += decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
};

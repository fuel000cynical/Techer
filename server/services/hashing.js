const hash = require('object-hash');

exports.returnHash = (thingToHash) => {
    return hash(thingToHash, {algorithm: 'md5', encoding: 'base64'})
}

const crypto = require('crypto');
const auth = require("../config/auth.config");
const api = require("../config/api.config");

const algorithm = 'aes-256-cbc';
const key = auth.secret;
const iv = api.iv.toString("hex").slice(0, 16);

function encrypt(text){
    const encrypter = crypto.createCipheriv(algorithm, key, iv);
    let encryptedMsg = encrypter.update(text, "utf8", "hex");
    encryptedMsg += encrypter.final("hex");
    return encryptedMsg;
};

function decrypt(hash){
    const decrypter = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedMsg = decrypter.update(hash, "hex", "utf8");
    decryptedMsg += decrypter.final("utf8");
    return decryptedMsg;
};

const compare = (req, res) => {
    const one = encrypt(req.headers.apikey);
    const two = decrypt(api.apikey);
    if(one === two) return 0;
    else return 1;
}

module.exports = {
    compare
};
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const crypto = require('crypto');
const auth = require("./app/config/auth.config");
const api = require("./app/config/api.config");

const algorithm = 'aes-256-cbc';
const pointa = crypto.randomBytes(16).toString('hex');
const ivs = crypto.randomBytes(16).toString('hex');
const iv = ivs.toString("hex").slice(0, 16);
const key = crypto.randomBytes(16).toString('hex');

const encrypter = crypto.createCipheriv(algorithm, key, iv);
let encryptedMsg = encrypter.update(pointa, "utf8", "hex");
encryptedMsg += encrypter.final("hex");

console.log("point A : "+ pointa);
console.log("iv : "+ iv.toString());
console.log("key : "+ key);
console.log("apikey : "+ encryptedMsg);

//Double Check
const decrypter = crypto.createDecipheriv(algorithm, key, iv);
let decryptedMsg = decrypter.update(encryptedMsg, "hex", "utf8");
decryptedMsg += decrypter.final("utf8");

if(pointa === decryptedMsg) console.log("DONE");
import {getSessionStore} from '@/util/Storage';

// 构建带签名的请求Url
const signatureUrl = (url) => {
    let timestamp = Math.round(new Date().getTime() / 1000);
    let nonce = getRandomNum(100000, 999999);
    let aesKey = getSessionStore("aesKey");
    let aesKeyId = getSessionStore("aesKeyId");
    let sortValue = [timestamp, nonce, aesKey].sort().join();
    sortValue = sortValue.replaceAll(",", "");
    let crypto = require('crypto');
    let signature = crypto.createHash('sha1').update(sortValue).digest('hex');
    url += "?signature=" + signature + "&timestamp=" + timestamp + "&nonce=" + nonce + "&aesKeyId=" + aesKeyId
    return url;
}

const getRandomNum = (min, max) => {
    let range = max - min;
    let rand = Math.random();
    return (min + Math.round(rand * range));
}

export default signatureUrl;
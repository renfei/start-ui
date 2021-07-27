import sha1 from "sha1";
import encryption from "@/libs/encryption"

// 构建带签名的请求Url
// eslint-disable-next-line no-unused-vars
const signatureUrl = (url) => {
    let timestamp = Math.round(new Date().getTime() / 1000);
    let nonce = getRandomNum(100000, 999999);
    let aesKeyId = "";
    encryption.getAESKey().then(val => {
        aesKeyId = val.KeyId;
    });
    let sortValue = sort(timestamp, nonce, aesKeyId);
    let signature = sha1(sortValue);
    url += "?signature=" + signature + "&timestamp=" + timestamp + "&nonce=" + nonce + "&aesKeyId=" + aesKeyId
    return url;
}

const getRandomNum = (min, max) => {
    let range = max - min;
    let rand = Math.random();
    return (min + Math.round(rand * range));
}

const sort = (v1, v2, v3) => {
    let arrVale = [
        {"value": v1},
        {"value": v2},
        {"value": v3},
    ];
    let res = Object.keys(arrVale).sort(function (a, b) {
        return arrVale[a]["value"] - arrVale[b]["value"]
    });
    let result = "";
    for (let key in res) {
        result += arrVale[res[key]["value"]];
    }
    return result;
}

export default signatureUrl;
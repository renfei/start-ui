import JsEncrypt from 'jsencrypt'
import NodeRSA from 'node-rsa'
import CryptoJS from 'crypto-js'
import {getSessionStore, setSessionStore} from '@/util/Storage';
import {getRSAkey, uploadRSAkey} from "@/api/start/auth";
import Message from '@/plugins/snackbar'

let encryption = {};

// RSA加密
encryption.rsaEncrypt = (publicKey, content) => {
    let jse = new JsEncrypt();
    jse.setPublicKey(publicKey);
    return jse.encrypt(content);
};

// RSA解密
encryption.rsaDecrypt = (privateKey, content) => {
    let jse = new JsEncrypt();
    jse.setPrivateKey('-----BEGIN PRIVATE KEY-----\n' +
        privateKey +
        '\n-----END PRIVATE KEY-----\n');
    return jse.decrypt(content);
};

// AES 加密
encryption.aesEncrypt = (content) => {
    return new Promise((resolve, reject) => {
        reject;
        encryption.getAESKey().then((aesRes => {
            let result = {};
            result.KeyId = aesRes.aesKeyId;
            result.content = aesencrypt(content, aesRes.aesKey);
            resolve(result);
        }));
    });
};

// AES 解密
encryption.aesDecrypt = (content) => {
    return new Promise((resolve, reject) => {
        reject;
        encryption.getAESKey().then((aesRes => {
            resolve(aesdecrypt(content, aesRes.aesKey));
        }));
    });
};

// 获取AES秘钥
encryption.getAESKey = () => {
    return new Promise((resolve, reject) => {
        let key = getSessionStore("aesKey");
        // 如果Store里没有那么就去申请
        if (key === null || key === undefined) {
            // 生成客户端的公钥和私钥
            encryption.getClientPublicKey().then(val => {
                val;
                let params = {};
                // 获取服务器端公钥
                getRSAkey(params).then(res => {
                    if (res.code !== 200) {
                        Message.error(res.message);
                        reject();
                    }
                    let serverPublicKey = res.data.publicKey;
                    let serverPublicKeyId = res.data.keyId;
                    // 使用服务器端公钥加密客户端公钥，注意服务器端公钥是2048，客户端公钥是1024
                    let clientEncryptPublicKey = encryption.rsaEncrypt(serverPublicKey, getSessionStore("ClientPublicKey"));
                    let reportPublicKeyVO = {};
                    reportPublicKeyVO.keyId = serverPublicKeyId;
                    reportPublicKeyVO.publicKey = clientEncryptPublicKey;
                    // 将加密好的客户端公钥上报给服务器
                    uploadRSAkey(reportPublicKeyVO).then(serverRes => {
                        if (serverRes.code === 200) {
                            // 用客户端私钥解密服务器返回的AES秘钥
                            let aesKey = encryption.rsaDecrypt(getSessionStore("ClientPrivateKey"), serverRes.data.privateKey);
                            let keys = {};
                            keys.aesKey = aesKey;
                            keys.aesKeyId = serverRes.data.keyId;
                            // 存储下来 AES 秘钥，现在这个秘钥全世界只有你知和我知，不要公开，不要在网络上明文传输
                            setSessionStore("aesKey", aesKey);
                            setSessionStore("aesKeyId", serverRes.data.keyId);
                            resolve(keys);
                        } else {
                            console.error(serverRes.message);
                            Message.error(serverRes.message);
                            reject();
                        }
                    });
                });
            });
        } else {
            let keys = {};
            keys.aesKey = getSessionStore("aesKey");
            keys.aesKeyId = getSessionStore("aesKeyId");
            resolve(keys);
        }
    });
};

// 获取客户端私钥
encryption.getClientPrivateKey = () => {
    return new Promise((resolve, reject) => {
        reject;
        let key = getSessionStore("ClientPrivateKey");
        if (key == null || key == undefined) {
            generateKey();
            resolve(getSessionStore("ClientPrivateKey"));
        }
        resolve(key);
    });
};

// 获取客户端公钥
encryption.getClientPublicKey = () => {
    return new Promise((resolve, reject) => {
        reject;
        let key = getSessionStore("ClientPublicKey");
        if (key == null || key == undefined) {
            generateKey();
            resolve(getSessionStore("ClientPublicKey"));
        }
        resolve(key);
    });
};

// 生成秘钥对
function generateKey() {
    const key = new NodeRSA({b: 1024});
    key.setOptions({encryptionScheme: 'pkcs1'});//指aesencrypt定加密格式
    let publicDer = key.exportKey("pkcs8-public-pem");  //公钥
    let privateDer = key.exportKey("pkcs8-private-pem");//私钥
    publicDer = publicDer.replace("-----BEGIN PUBLIC KEY-----\n", "").replace("\n-----END PUBLIC KEY-----", "");
    privateDer = privateDer.replace("-----BEGIN PRIVATE KEY-----\n", "").replace("\n-----END PRIVATE KEY-----", "");
    setSessionStore('ClientPublicKey', publicDer);
    setSessionStore('ClientPrivateKey', privateDer);
}

//加密
function aesencrypt(word, keyStr) {
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(keyStr);
    let srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

    // var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    // var srcs = CryptoJS.enc.Utf8.parse(word);
    // var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    // return encrypted.toString();
}

//解密
function aesdecrypt(word, keyStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);//Latin1 w8m31+Yy/Nw6thPsMpO5fg==
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

export default encryption;
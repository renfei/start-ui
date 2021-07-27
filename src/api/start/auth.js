import {
    getRequest,
    postRequest
} from '@/libs/axios';

import Signature from '@/util/Signature'

// <editor-fold desc="秘钥交换接口" defaultstate="collapsed">

// 获取服务器端的RSA公钥
export const getRSAkey = (params) => {
    return getRequest('/api/auth/secretKey', params)
};

// 上报客户端的RSA公钥
export const uploadRSAkey = (params) => {
    return postRequest('/api/auth/secretKey', params, "application/json")
};

// </editor-fold>

// <editor-fold desc="账户认证接口" defaultstate="collapsed">

// 登陆
export const signIn = (params) => {
    return postRequest(Signature('/api/auth/signIn'), params)
};

// 获取登陆账户信息
export const myInfo = (params) => {
    return getRequest(Signature('/api/auth/myInfo'), params)
};

// </editor-fold>


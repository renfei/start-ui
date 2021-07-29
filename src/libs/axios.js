import axios from 'axios';
import {getSessionStore, removeSessionStore} from '@/util/Storage';
import router from '../router/index';
import Message from '@/plugins/snackbar'

// 统一请求路径前缀
let base = '/v1';
// 超时设定
axios.defaults.timeout = 15000;

axios.interceptors.request.use(config => {
    return config;
}, err => {
    Message.error("请求超时");
    return Promise.resolve(err);
});

// http response 拦截器
axios.interceptors.response.use(response => {
    const data = response.data;

    // 根据返回的code值来做不同的处理(和后端约定)
    switch (data.code) {
        case 401:
            // 未登录 清除已登录状态
            removeSessionStore('userInfo');
            removeSessionStore('accessToken');
            router.push('/signin');
            break;
        case 403:
            // 没有权限
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        case 500:
            // 错误
            if (data.message !== null) {
                Message.error(data.message);
            } else {
                Message.error("未知错误");
            }
            break;
        default:
            return data;
    }

    return data;
}, (err) => {
    console.error(JSON.stringify(err))
    if (err.message === "Request failed with status code 401") {
        removeSessionStore('userInfo');
        removeSessionStore('accessToken');
        router.push('/signin');
        return Promise.resolve(err);
    }
    // 返回状态码不为200时候的错误处理
    Message.error(err.toString());
    return Promise.resolve(err);
});

export const getRequest = (url, params) => {
    let accessToken = getSessionStore('accessToken');
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Authorization': "Bearer " + accessToken
        }
    }
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params,
        headers: headers
    });
};

export const postRequest = (url, params) => {
    let accessToken = getSessionStore("accessToken");
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + accessToken
        }
    } else {
        headers = {
            'Content-Type': 'application/json'
        }
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: headers
    });
};

export const postFormRequest = (url, params) => {
    let accessToken = getSessionStore("accessToken");
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Bearer " + accessToken
        }
    } else {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: headers
    });
};

export const putRequest = (url, params) => {
    let accessToken = getSessionStore("accessToken");
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + accessToken
        }
    } else {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        headers: headers
    });
};

export const putFormRequest = (url, params) => {
    let accessToken = getSessionStore("accessToken");
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': "Bearer " + accessToken
        }
    } else {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret;
        }],
        headers: headers
    });
};

export const deleteRequest = (url, params) => {
    let accessToken = getSessionStore('accessToken');
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Authorization': "Bearer " + accessToken
        }
    }
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params,
        headers: headers
    });
};

export const uploadFileRequest = (url, params) => {
    let accessToken = getSessionStore('accessToken');
    let headers = {};
    if (accessToken != null) {
        headers = {
            'Authorization': "Bearer " + accessToken,
            "Content-Type": "multipart/form-data"
        }
    }
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        headers: headers
    });
};
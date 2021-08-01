import {
    getRequest,
    postRequest,
    deleteRequest
} from '@/libs/axios';

import Signature from '@/util/Signature'

// 获取系统资源配置
export const getAllPermissionList = (params) => {
    return getRequest(Signature('/api/sys/permission'), params)
};

// 编辑系统资源配置
export const editPermission = (params) => {
    return postRequest(Signature('/api/sys/permission'), params)
};

export const deletePermissionById = (params) => {
    return deleteRequest(Signature('/api/sys/permission'), params)
};

export const getSysMenu = (params) => {
    return getRequest(Signature('/api/sys/menu'), params)
};

export const getAllMenu = (params) => {
    return getRequest(Signature('/api/sys/menu/all'), params)
};

export const editSysMenu = (params) => {
    return postRequest(Signature('/api/sys/menu'), params)
};

export const deleteSysMenu = (params) => {
    return deleteRequest(Signature('/api/sys/menu'), params)
};

export const getAllRole = (params) => {
    return getRequest(Signature('/api/sys/role'), params)
};

export const editSysRole = (params) => {
    return postRequest(Signature('/api/sys/role'), params)
};

export const deleteSysRole = (params) => {
    return deleteRequest(Signature('/api/sys/role'), params)
};
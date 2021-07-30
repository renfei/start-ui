import {
    getRequest
} from '@/libs/axios';

import Signature from '@/util/Signature'

// 获取系统资源配置
export const getAllPermissionList = (params) => {
    return getRequest(Signature('/api/sys/permission'), params)
};
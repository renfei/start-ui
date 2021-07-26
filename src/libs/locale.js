import {setLocalStore} from '@/util/Storage';

let locale = {};

locale.list = () => {
    return [
        {text: '中文（简体）', value: 'zh-CN'},
        {text: 'English(US)', value: 'en-US'},
        {text: '日本語', value: 'ja-JP'}
    ];
};
locale.setLocale = (locale) => {
    setLocalStore('locale', locale);
};

export default locale;
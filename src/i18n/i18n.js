import Vue from 'vue'
import Vue18n from 'vue-i18n'

Vue.use(Vue18n);

export default new Vue18n({
    locale: localStorage.getItem('locale') || 'zh-CN',    // 语言标识
    messages: {
        'zh-CN': require('./messages/zh-CN'),
        'en-US': require('./messages/en-US'),
        'ja-JP': require('./messages/ja-JP')
    }
});
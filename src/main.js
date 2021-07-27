import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from '@/router'
import i18n from '@/i18n/i18n'
import Message from '@/commponents/Message/index'

Vue.config.productionTip = false
Vue.prototype.$message = Message

new Vue({
    vuetify,
    i18n,
    router,
    render: h => h(App),
}).$mount('#app')

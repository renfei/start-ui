import Vue from 'vue';
import Snackbar from '@/components/Snackbar';
import Vuetify from 'vuetify/lib';

let init = false;
let msgbar = {}
let vm = {};

const ini = function () {
    if (!init) {
        const SnackbarConstructor = Vue.extend(Snackbar)
        const instance = new SnackbarConstructor()
        instance.$vuetify = new Vuetify().framework;
        vm = instance.$mount()
        document.body.appendChild(vm.$el);
        init = true;
    }
    return vm;
}

msgbar.info = function (text) {
    ini();
    return vm.show(text, "#757575", "mdi-alert-circle")
}

msgbar.ok = function (text) {
    ini();
    return vm.show(text, "#1B5E20", "mdi-checkbox-marked-circle")
}

msgbar.warning = function (text) {
    ini();
    return vm.show(text, "#F57F17", "mdi-alert")
}

msgbar.error = function (text) {
    ini();
    return vm.show(text, "#D50000", "mdi-alert")
}

export default msgbar;
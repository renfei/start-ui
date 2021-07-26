import {getLocalStore, setLocalStore} from '@/util/Storage'

let utils = {};

utils.loadTheme = function (obj) {
    let theme = getLocalStore("theme_dark");
    console.log("loadTheme:" + theme)
    if (theme === null || theme === undefined) {
        obj.$vuetify.theme.dark = false;
        setLocalStore("theme_dark", false);
    } else {
        obj.$vuetify.theme.dark = theme === 'true';
    }
}

utils.theme = function (obj) {
    let theme = getLocalStore("theme_dark");
    console.log("theme:" + theme)
    if (theme === null || theme === undefined) {
        obj.$vuetify.theme.dark = false;
        setLocalStore("theme_dark", false);
    } else {
        let themeBool = theme === 'true'
        obj.$vuetify.theme.dark = !themeBool;
        setLocalStore("theme_dark", !themeBool);
    }
}

export default utils;
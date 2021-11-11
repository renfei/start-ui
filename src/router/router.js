import Console from "@/Console"
import Home from "@/pages/console/Home"
import SignIn from "@/pages/SignIn"
import Resources from "@/pages/console/sys/Resources"
import Menu from "@/pages/console/sys/Menu"
import Role from "@/pages/console/sys/Role"
import TinyMCE from "@/components/TinyMCE"

const signInRouter = {
    path: '/signIn',
    name: 'signIn',
    meta: {
        title: '登录 '
    },
    component: SignIn
};

const consoleRouter = {
    path: '/',
    name: 'consoleRouter',
    redirect: '/console',
    component: Console,
    children: [
        {
            path: 'console', meta: {title: "Home"}, name: 'home', component: Home
        },
        {
            path: 'console/sys/resources', meta: {title: "Resources"}, name: 'resources', component: Resources
        },
        {
            path: 'console/sys/menu', meta: {title: "Menu"}, name: 'menu', component: Menu
        },
        {
            path: 'console/sys/role', meta: {title: "Role"}, name: 'role', component: Role
        },
    ]
}

const devRouter = {
    path: '/dev',
    name: 'devRouter',
    component: TinyMCE,
    children: []
}

const routers = [
    signInRouter,
    consoleRouter,
    devRouter
];
export default routers
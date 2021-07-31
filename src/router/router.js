import Console from "@/Console"
import Home from "@/pages/console/Home"
import SignIn from "@/pages/SignIn"
import Resources from "@/pages/console/sys/Resources"
import Menu from "@/pages/console/sys/Menu"

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
    ]
}

const routers = [
    signInRouter,
    consoleRouter
];
export default routers
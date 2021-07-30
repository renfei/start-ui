import Console from "@/Console"
import Home from "@/pages/console/Home"
import SignIn from "@/pages/SignIn"
import Resources from "@/pages/console/sys/Resources"

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
    ]
}

const routers = [
    signInRouter,
    consoleRouter
];
export default routers
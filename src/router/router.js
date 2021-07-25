import Console from "@/Console"
import Home from "@/pages/Home"

const consoleRouter = {
    path: '/',
    name: 'consoleRouter',
    redirect: '/console',
    component: Console,
    children: [
        {
            path: 'console', meta: {title: "Home"}, name: 'home', component: Home
        },
    ]
}

const routers = [
    consoleRouter
];
export default routers
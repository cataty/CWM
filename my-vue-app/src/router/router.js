import {createRouter, createWebHistory} from 'vue-router'
import Home from '../pages/Home.vue'
import GlobalChat from '../pages/GlobalChat.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'

const routes = [
    { path: '/',            component: Home },
    { path: '/globalchat',  component: GlobalChat},
    { path: '/login',       component: Login},
    { path: '/register',    component: Register}
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router;
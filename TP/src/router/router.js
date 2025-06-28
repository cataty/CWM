import { createRouter, createWebHashHistory } from "vue-router";
import Home from '../pages/Home.vue';
import Feed from '../pages/Feed.vue';
import Deal from "../pages/Deal.vue";
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import UserProfile from '../pages/UserProfile.vue';
import UserProfileEdit from '../pages/UserProfileEdit.vue';
import UserList from "../pages/UserList.vue";
import PostEdit from "../pages/PostEdit.vue";
import { subscribeToAuth } from "../services/auth";
import UserProfileEditAvatar from "../pages/UserProfileEditAvatar.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/registro', component: Register },
    { path: '/feed', component: Feed, meta: { requiresAuth: true, }, },
    { path: '/usuarios/editar/', component: UserProfileEdit, meta: { requiresAuth: true, }, },
    { path: '/usuarios/editar/avatar', component: UserProfileEditAvatar, meta: { requiresAuth: true, }, },
    { path: '/usuarios/:id', component: UserProfile, meta: { requiresAuth: true, }, },
    { path: '/usuarios', component: UserList, meta: { requiresAuth: true, }, },
    { path: '/post/editar/:id', component: PostEdit, meta: { requiresAuth: true, }, },
    { path: '/post/:id', component: Deal, meta: { requiresAuth: true, }, },

]

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let user = {
    id: null,
    email: null
}

subscribeToAuth(userData => user = userData);

router.beforeEach((to, from) => { // from = data de la ruta de la que viene el request, to = data de la ruta nueva
    if (to.meta.requiresAuth && user.id === null) {
        return "/login";
    }
})

export default router;

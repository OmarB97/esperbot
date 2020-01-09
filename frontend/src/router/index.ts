import Vue from 'vue';
import VueRouter from 'vue-router';
import Activate from '@/views/Activate.vue';
import Authenticate from '@/views/Authenticate.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        beforeEnter: (to: any, from: any, next: (path: string) => void) => {
            if (!store.state.isActivated) {
                console.log('not activated yet');
                next('/activate');
            } else if (store.state.isActivated) {
                store.dispatch('authenticate').then(res => {
                    if (res) {
                        if (store.state.isAuthenticated) next('/home');
                    }
                });
            } else {
                next('/authenticate');
            }
        },
    },
    {
        path: '/authenticate',
        name: 'authenticate',
        component: Authenticate,
    },
    {
        path: '/activate',
        name: 'activate',
        component: Activate,
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
    },
    {
        path: '/about',
        name: 'about',
        component: About,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

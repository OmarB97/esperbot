import Vue from 'vue';
import VueRouter from 'vue-router';
import Activate from '@/views/Activate.vue';
import Authenticate from '@/views/Authenticate.vue';
import Home from '@/views/Home.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        beforeEnter: async (to, from, next): Promise<void> => {
            if (!store.state.isActivated) {
                next('/activate');
            } else {
                await store.dispatch('authenticate').then(res => {
                    if (res.res && store.state.isAuthenticated) {
                        next('/home');
                    } else {
                        next({ name: 'authenticate', params: { authErr: res.err } });
                    }
                });
            }
        },
    },
    {
        path: '/activate',
        name: 'activate',
        component: Activate,
    },
    {
        path: '/authenticate',
        name: 'authenticate',
        component: Authenticate,
        props: true,
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

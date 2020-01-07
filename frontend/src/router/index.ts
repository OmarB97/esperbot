import Vue from 'vue';
import VueRouter from 'vue-router';
import Welcome from '@/views/Welcome.vue';
import Register from '@/views/Register.vue';
import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeRouteEnter: (to: any, from: any, next: (path: string) => void) => {
      // This will change when we have Firebase and auth tokens
      store.dispatch('isRegistered').then(res => {
        if (res) {
          next('/home');
        }
      });
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
console.log(process.env.BASE_URL);
console.log(router.currentRoute);

export default router;

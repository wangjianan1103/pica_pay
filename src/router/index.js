import Vue from 'vue';
import Router from 'vue-router';
import Index from '../components/index/Index.vue';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index',
      component: Index
    },
    {
      path: '/index',
      component: Index
    }
  ]
});

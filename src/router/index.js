import Vue from 'vue'
import Router from 'vue-router'
import home from '../views/home/home'
import dashboard from '../views/home/dashboard'
import list from '../views/list/list'
import table from '../views/table/table'
// import editor from '../views/editor/editor'
// import ueditor from '../views/editor/ueditor'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path:'/dashboard',
          name:'dashboard',
          component:dashboard
        },
        {
          path:'/list',
          name:'list',
          component:list
        },
        {
          path:'/table',
          name:'table',
          component:table
        },
        // {
        //   path:'/editor',
        //   name:'editor',
        //   component:editor
        // },
        // {
        //   path:'/ueditor',
        //   name:'ueditor',
        //   component:ueditor
        // }
      ]
    },
    // {
    //   path: '/dashboard',
    //   name: 'dashboard',
    //   component: () => import( './views/home/dashboard.vue')
    // }

  ]
})

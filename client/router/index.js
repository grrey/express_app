import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)

import { home, album, dayly } from '../views'

var router = new VueRouter({
  routes: [
    {
      name: 'home',
      path: '/',
      component: home
    },
    {
      name: 'album',
      path: '/album',
      component: album
    },
    
	{
		name: 'dayly',
		path: '/dayly',
		component: dayly
	  }
  ]
})

export default router
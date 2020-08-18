import Vue from 'vue'
import VueRouter from 'vue-router'

import App from '@/App'

import Home from '@/components/Home'
import Login from '@/components/Login'

import CategoryFirst from '@/components/home/CategoryFirst'
import CategoryManagement from '@/components/home/CategoryManagement'
import Chapter from '@/components/home/Chapter'
import Novel from '@/components/home/Novel'
import NovelManagement from '@/components/home/NovelManagement'
import Volume from '@/components/home/Volume'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    component: App
  },
  {
    path: '/home',
    component: Home,
    children: [
      {
        path: 'categoryFirst',
        component: CategoryFirst
      },
      {
        path: 'categoryManagement',
        component: CategoryManagement
      },
      {
        path: 'chapter',
        component: Chapter
      },
      {
        path: 'novel',
        component: Novel
      },
      {
        path: 'novelManagement',
        component: NovelManagement
      },
      {
        path: 'volume',
        component: Volume
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import { createRouter, createWebHistory } from "vue-router";

import UserDetail from "@/views/users/UserDetail.vue"
import Login from "@/views/Login.vue"
import Dashboard from "@/components/Dashboard.vue"
import NotFound from "@/views/NotFound.vue"



const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/userDetail', name: 'UserDetail', component: UserDetail },
  { path: '/login', name: 'Login', component: Login },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
  
export default router;
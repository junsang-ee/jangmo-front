import { createRouter, createWebHistory } from "vue-router";

import UserDetail from "@/views/pages/users/UserDetail.vue"
import Login from "@/views/Login.vue"
import Dashboard from "@/views/components/Dashboard.vue"
import NotFound from "@/views/pages/error/NotFound.vue"
import InternalServer from "@/views/pages/error/InternalServer.vue"


const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/userDetail', name: 'UserDetail', component: UserDetail },
  { path: '/login', name: 'Login', component: Login },
  { path: "/404", name: "NotFound", component: NotFound },
  { path: "/500", name: "InternalServer", component: InternalServer },
  { path: "/:pathMatch(.*)*", redirect: "/404" }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
  
export default router;
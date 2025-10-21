import { createRouter, createWebHistory } from 'vue-router';

import UserDetail from '@/views/pages/users/UserDetail.vue';
import UserManagement from '@/views/pages/managements/UserManagement.vue';
import MatchManagement from '@/views/pages/managements/MatchManagement.vue';
import VoteManagement from '@/views/pages/managements/VoteManagement.vue';
import GroundManagement from '@/views/pages/managements/GroundManagement.vue';


import Login from '@/views/pages/auth/Login.vue';
import Dashboard from '@/views/components/Dashboard.vue';
import NotFound from '@/views/pages/error/NotFound.vue';
import InternalServer from '@/views/pages/error/InternalServer.vue';

const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/userDetail', name: 'UserDetail', component: UserDetail },
  { path: '/userManagement', name: 'UserManagement', component: UserManagement },
  { path: '/matchManagement', name: 'MatchManagement', component: MatchManagement },
  { path: '/voteManagement', name: 'VoteManagement', component: VoteManagement },
  { path: '/groundManagement', name: 'GroundManagement', component: GroundManagement },
  { path: '/login', name: 'Login', component: Login },
  { path: '/404', name: 'NotFound', component: NotFound },
  { path: '/500', name: 'InternalServer', component: InternalServer },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
  
export default router;
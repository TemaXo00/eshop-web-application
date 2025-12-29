import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import TestView from "@/views/TestView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresGuest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
            meta: { requiresGuest: true }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        },
        {
            path: '/test',
            name: 'Test',
            component: TestView,
            meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (requiresGuest && authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
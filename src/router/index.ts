import { createRouter, createWebHistory } from '@ionic/vue-router'
import { auth } from '../firebase/config'
import LoginPage from '../views/LoginPage.vue'; import RegisterPage from '../views/RegisterPage.vue'; import ResetPasswordPage from '../views/ResetPasswordPage.vue'; import WelcomePage from '../views/WelcomePage.vue'; import ProfilePage from '../views/ProfilePage.vue'
const router = createRouter({ history: createWebHistory(import.meta.env.BASE_URL), routes: [{ path: '/', redirect: '/welcome' }, { path: '/login', component: LoginPage, meta: { guestOnly: true } }, { path: '/register', component: RegisterPage, meta: { guestOnly: true } }, { path: '/reset-password', component: ResetPasswordPage, meta: { guestOnly: true } }, { path: '/welcome', component: WelcomePage, meta: { requiresAuth: true } }, { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } }, { path: '/:pathMatch(.*)*', redirect: '/welcome' }] })
let resolveAuth: (() => void) | undefined
const authInitialized = new Promise<void>((resolve) => { resolveAuth = resolve })
auth.authStateReady().then(() => resolveAuth?.())
router.beforeEach(async (to) => { await authInitialized; if (to.meta.requiresAuth && !auth.currentUser) return '/login'; if (to.meta.guestOnly && auth.currentUser) return '/welcome'; return true })
export default router

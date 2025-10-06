import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { setupRoleBasedRedirect, setupAuthGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Ajouter les guards de navigation
router.beforeEach((to, from, next) => {
  // D'abord vérifier l'authentification
  setupAuthGuard(to, from, next)
})

router.beforeEach((to, from, next) => {
  // Ensuite gérer les redirections basées sur les rôles
  setupRoleBasedRedirect(to, from, next)
})

export default function (app: App) {
  app.use(router)
}

export { router }

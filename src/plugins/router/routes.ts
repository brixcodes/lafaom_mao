export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
  // Users
      // Permissions
      {
        path: 'permissions',
        component: () => import('@/pages/permissions/index.vue'),
      },
      {
        path: 'users',
        component: () => import('@/pages/users/index.vue'),
      },
      {
        path: 'users/create',
        component: () => import('@/pages/users/create.vue'),
      },
      {
        path: 'users/:id',
        component: () => import('@/pages/users/detail.vue'),
      },
      {
        path: 'users/:id/edit',
        component: () => import('@/pages/users/edit.vue'),
      },
      // Blog
      {
        path: 'blog',
        component: () => import('@/pages/blog/index.vue'),
      },
      {
        path: 'blog/posts',
        component: () => import('@/pages/blog/posts/index.vue'),
      },
      {
        path: 'blog/posts/create',
        component: () => import('@/pages/blog/posts/create.vue'),
      },
      {
        path: 'blog/posts/:id',
        component: () => import('@/pages/blog/posts/detail.vue'),
      },
      {
        path: 'blog/posts/:id/edit',
        component: () => import('@/pages/blog/posts/edit.vue'),
      },
      {
        path: 'blog/categories',
        component: () => import('@/pages/blog/categories/index.vue'),
      },
      {
        path: 'blog/categories/create',
        component: () => import('@/pages/blog/categories/create.vue'),
      },
      {
        path: 'blog/categories/:id/edit',
        component: () => import('@/pages/blog/categories/edit.vue'),
      },
      // Sections
      {
        path: 'blog/sections',
        component: () => import('@/pages/blog/sections/index.vue'),
      },
      {
        path: 'blog/sections/create',
        component: () => import('@/pages/blog/sections/create.vue'),
      },
      {
        path: 'blog/sections/:id',
        component: () => import('@/pages/blog/sections/detail.vue'),
      },
      {
        path: '/blog/categories/create',
        component: () => import('@/pages/blog/categories/create.vue'),
      },
      // Job Offers
      {
        path: 'job-offers',
        component: () => import('@/pages/job-offers/index.vue'),
      },
      {
        path: 'job-offers/create',
        component: () => import('@/pages/job-offers/create.vue'),
      },
      {
        path: 'job-offers/:id',
        component: () => import('@/pages/job-offers/detail.vue'),
      },
      {
        path: 'job-offers/:id/edit',
        component: () => import('@/pages/job-offers/edit.vue'),
      },
      {
        path: 'job-offers/applications',
        component: () => import('@/pages/job-offers/applications/index.vue'),
      },
      // Training
      {
        path: 'training',
        component: () => import('@/pages/training/index.vue'),
      },
      {
        path: 'training/trainings',
        component: () => import('@/pages/training/trainings/index.vue'),
      },
      {
        path: 'training/trainings/create',
        component: () => import('@/pages/training/trainings/create.vue'),
      },
      {
        path: 'training/trainings/:id',
        component: () => import('@/pages/training/trainings/detail.vue'),
      },
      {
        path: 'training/sessions',
        component: () => import('@/pages/training/sessions/index.vue'),
      },
      {
        path: 'training/applications',
        component: () => import('@/pages/training/applications/index.vue'),
      },
      // Payments
      {
        path: 'payments',
        component: () => import('@/pages/payments/index.vue'),
      },
      {
        path: 'payments/:id',
        component: () => import('@/pages/payments/detail.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/auth/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/auth/register.vue'),
      },
      {
        path: 'forgot-password',
        component: () => import('@/pages/auth/forgot-password.vue'),
      },
      {
        path: 'reset-password',
        component: () => import('@/pages/auth/reset-password.vue'),
      },
      {
        path: 'two-factor',
        component: () => import('@/pages/auth/two-factor.vue'),
      },
      {
        path: 'change-email',
        component: () => import('@/pages/auth/change-email.vue'),
      },
      {
        path: 'validate-change-email',
        component: () => import('@/pages/auth/validate-change-email.vue'),
      },
      {
        path: 'update-password',
        component: () => import('@/pages/auth/update-password.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]

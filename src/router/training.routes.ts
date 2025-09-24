import specialtyRoutes from './training/specialty.routes'

const routes = [
  {
    path: '/training',
    name: 'training',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      // Training catalog routes
      {
        path: 'trainings',
        name: 'training-trainings-index',
        component: () => import('@/pages/training/trainings/index.vue'),
      },
      {
        path: 'trainings/create',
        name: 'training-trainings-create',
        component: () => import('@/pages/training/trainings/create.vue'),
      },
      {
        path: 'trainings/:id',
        name: 'training-trainings-detail',
        component: () => import('@/pages/training/trainings/detail.vue'),
      },
      {
        path: 'trainings/:id/edit',
        name: 'training-trainings-edit',
        component: () => import('@/pages/training/trainings/edit.vue'),
      },
      // Training sessions routes
      {
        path: 'sessions',
        name: 'training-sessions-index',
        component: () => import('@/pages/training/sessions/index.vue'),
      },
      {
        path: 'sessions/create',
        name: 'training-sessions-create',
        component: () => import('@/pages/training/sessions/create.vue'),
      },
      {
        path: 'sessions/:id',
        name: 'training-sessions-detail',
        component: () => import('@/pages/training/sessions/detail.vue'),
      },
      {
        path: 'sessions/:id/edit',
        name: 'training-sessions-edit',
        component: () => import('@/pages/training/sessions/edit.vue'),
      },
      // Training applications routes
      {
        path: 'applications',
        name: 'training-applications-index',
        component: () => import('@/pages/training/applications/index.vue'),
      },
      {
        path: 'applications/create',
        name: 'training-applications-create',
        component: () => import('@/pages/training/applications/create.vue'),
      },
      {
        path: 'applications/:trainingId/apply',
        name: 'training-application-create',
        component: () => import('@/pages/training/applications/create.vue'),
        meta: {
          title: 'Candidater à une formation',
          requiresAuth: false, // Public
        },
        props: true
      },
      {
        path: 'applications/success',
        name: 'training-application-success',
        component: () => import('@/pages/training/applications/success.vue'),
        meta: {
          title: 'Candidature soumise',
          requiresAuth: false, // Public
        }
      },
      {
        path: 'applications/:id',
        name: 'training-applications-detail',
        component: () => import('@/pages/training/applications/detail.vue'),
      },
      {
        path: 'applications/:id/edit',
        name: 'training-applications-edit',
        component: () => import('@/pages/training/applications/edit.vue'),
      },
      // My applications routes
      {
        path: 'my-applications',
        name: 'training-my-applications-index',
        component: () => import('@/pages/training/my-applications/index.vue'),
      },
      {
        path: 'my-applications/:id',
        name: 'training-my-applications-detail',
        component: () => import('@/pages/training/my-applications/detail.vue'),
      },
      // Training registrations routes
      {
        path: 'registrations/session/:id',
        name: 'training-session-register',
        component: () => import('@/pages/training/registrations/session-register.vue'),
        meta: {
          title: 'Inscription à une session',
          requiresAuth: false, // Public
        },
        props: true
      },
      {
        path: 'registrations/success',
        name: 'training-registration-success',
        component: () => import('@/pages/training/registrations/success.vue'),
        meta: {
          title: 'Inscription réussie',
          requiresAuth: false, // Public
        }
      },
      // Specialty routes
      {
        path: 'specialties',
        name: 'training-specialties-index',
        component: () => import('@/pages/training/specialties/index.vue'),
        meta: {
          requiresAuth: true,
          action: 'read',
          subject: 'Training',
          title: 'Training Specialties',
        },
      },
      {
        path: 'specialties/create',
        name: 'specialty-create',
        component: () => import('@/components/Training/Specialty/SpecialtyForm.vue'),
        meta: {
          requiresAuth: true,
          action: 'create',
          subject: 'Training',
          title: 'Create Specialty',
        },
        beforeEnter: [() => import('@/plugins/casl').then(m => m.hasPermission('create', 'Training'))],
      },
      {
        path: 'specialties/:id/edit',
        name: 'specialty-edit',
        component: () => import('@/components/Training/Specialty/SpecialtyForm.vue'),
        props: route => ({ specialtyId: parseInt(route.params.id as string) }),
        meta: {
          requiresAuth: true,
          action: 'update',
          subject: 'Training',
          title: 'Edit Specialty',
        },
        beforeEnter: [() => import('@/plugins/casl').then(m => m.hasPermission('update', 'Training'))],
      },
    ],
  },
]

export default routes

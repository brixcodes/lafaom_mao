export const routes = [
  { path: '/', redirect: '/dashboard' }, // Redirection par défaut, sera gérée par le guard
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      // Profile
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('@/pages/profile/simple.vue'),
        meta: {
          title: 'Mon profil',
          requiresAuth: true
        }
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
      {
        path: 'users/role-permissions',
        component: () => import('@/pages/users/role-permissions.vue'),
        meta: {
          title: 'Gestion des Rôles et Permissions',
          requiresAuth: true,
          requiresPermission: 'can_give_permission'
        }
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
      // Job Offers - Module d'emploi complet
      {
        path: 'jobs/offers',
        name: 'job-offers-list',
        component: () => import('@/pages/jobs/JobOffersList.vue'),
        meta: {
          title: 'Offres d\'emploi',
          requiresAuth: false
        }
      },
      {
        path: 'jobs/offers/create',
        name: 'job-offers-create',
        component: () => import('@/pages/jobs/JobOfferCreate.vue'),
        meta: {
          title: 'Créer une offre',
          requiresAuth: true,
          permissions: ['job_offers.create']
        }
      },
      {
        path: 'jobs/offers/:id',
        name: 'job-offers-detail',
        component: () => import('@/pages/jobs/JobOfferDetail.vue'),
        meta: {
          title: 'Détails de l\'offre',
          requiresAuth: false
        },
        props: true
      },
      {
        path: 'jobs/offers/:id/edit',
        name: 'job-offers-edit',
        component: () => import('@/pages/jobs/JobOfferEdit.vue'),
        meta: {
          title: 'Modifier l\'offre',
          requiresAuth: true,
          permissions: ['job_offers.update']
        },
        props: true
      },
      {
        path: 'jobs/offers/:id/apply',
        name: 'job-offers-apply',
        component: () => import('@/pages/jobs/JobOfferApply.vue'),
        meta: {
          title: 'Candidater',
          requiresAuth: false
        },
        props: true
      },
      {
        path: 'jobs/applications',
        name: 'job-applications',
        component: () => import('@/pages/jobs/JobApplications.vue'),
        meta: {
          title: 'Candidatures',
          requiresAuth: true,
          permissions: ['job_applications.view']
        }
      },
      {
        path: 'jobs/applications/:id',
        name: 'job-applications-detail',
        component: () => import('@/pages/jobs/JobApplicationDetail.vue'),
        meta: {
          title: 'Détails de la candidature',
          requiresAuth: true,
          permissions: ['job_applications.view']
        },
        props: true
      },
      {
        path: 'jobs/applications/my-applications',
        name: 'my-job-applications',
        component: () => import('@/pages/jobs/MyApplications.vue'),
        meta: {
          title: 'Mes candidatures',
          requiresAuth: true
        }
      },
      {
        path: 'jobs/stats',
        name: 'job-stats',
        component: () => import('@/pages/jobs/JobStats.vue'),
        meta: {
          title: 'Statistiques emploi',
          requiresAuth: true,
          permissions: ['job_offers.view', 'job_applications.view']
        }
      },
      // Routes pour les candidatures
      {
        path: 'jobs/applications/create',
        name: 'job-application-create-general',
        component: () => import('@/pages/job-applications/create.vue'),
        meta: {
          title: 'Nouvelle candidature',
          requiresAuth: false
        }
      },
      {
        path: 'jobs/applications/create/:offerId',
        name: 'job-application-create',
        component: () => import('@/pages/job-applications/create.vue'),
        meta: {
          title: 'Candidater à cette offre',
          requiresAuth: false
        },
        props: true
      },
      {
        path: 'jobs/applications/success',
        name: 'job-application-success',
        component: () => import('@/pages/job-applications/success.vue'),
        meta: {
          title: 'Candidature envoyée',
          requiresAuth: false
        }
      },
      // Anciennes routes pour compatibilité
      {
        path: 'job-offers',
        redirect: '/jobs/offers'
      },
      {
        path: 'job-offers/:pathMatch(.*)*',
        redirect: (to: any) => `/jobs/offers${to.params.pathMatch ? '/' + to.params.pathMatch : ''}`
      },
      // Organization Centers
      // --- Organization Centers module routes ---
      {
        path: 'organization-centers',
        name: 'organization-centers-index',
        component: () => import('@/pages/organization-centers/index.vue'),
      },
      {
        path: 'organization-centers/create',
        name: 'organization-centers-create',
        component: () => import('@/pages/organization-centers/create.vue'),
      },
      {
        path: 'organization-centers/:id',
        name: 'organization-centers-detail',
        component: () => import('@/pages/organization-centers/detail.vue'),
        props: true,
      },
      {
        path: 'organization-centers/:id/edit',
        name: 'organization-centers-edit',
        component: () => import('@/pages/organization-centers/edit.vue'),
        props: true,
      },

      // Specialties
      // --- Specialties module routes ---
      {
        path: 'specialties',
        name: 'specialties-index',
        component: () => import('@/pages/specialties/index.vue'),
      },
      {
        path: 'specialties/create',
        name: 'specialties-create',
        component: () => import('@/pages/specialties/create.vue'),
      },
      {
        path: 'specialties/:id',
        name: 'specialties-detail',
        component: () => import('@/pages/specialties/detail.vue'),
        props: true,
      },
      {
        path: 'specialties/:id/edit',
        name: 'specialties-edit',
        component: () => import('@/pages/specialties/edit.vue'),
        props: true,
      },

      // Student Applications
      // --- Student Applications module routes ---
      {
        path: 'student-applications',
        name: 'student-applications-index',
        component: () => import('@/pages/student-applications/index.vue'),
      },
      {
        path: 'student-applications/create',
        name: 'student-applications-create',
        component: () => import('@/pages/student-applications/create.vue'),
      },
      {
        path: 'student-applications/:id/payment',
        name: 'student-applications-payment',
        component: () => import('@/pages/student-applications/payment.vue'),
        props: true,
      },
      {
        path: 'my-student-applications',
        name: 'my-student-applications-index',
        component: () => import('@/pages/student-applications/my-applications.vue'),
      },

      // Reclamations
      // --- Reclamations module routes ---
      {
        path: 'reclamations',
        name: 'reclamations-index',
        component: () => import('@/pages/reclamations/index.vue'),
      },
      {
        path: 'reclamations/create',
        name: 'reclamations-create',
        component: () => import('@/pages/reclamations/create.vue'),
      },
      {
        path: 'reclamations/:id',
        name: 'reclamations-detail',
        component: () => import('@/pages/reclamations/detail.vue'),
        props: true,
      },
      {
        path: 'reclamations/:id/edit',
        name: 'reclamations-edit',
        component: () => import('@/pages/reclamations/edit.vue'),
        props: true,
      },
      {
        path: 'reclamations/types',
        name: 'reclamations-types',
        component: () => import('@/pages/reclamations/types.vue'),
      },
      {
        path: 'reclamations/types/create',
        name: 'reclamations-types-create',
        component: () => import('@/pages/reclamations/types/create.vue'),
      },
      {
        path: 'reclamations/types/:id/edit',
        name: 'reclamations-types-edit',
        component: () => import('@/pages/reclamations/types/edit.vue'),
        props: true,
      },
      // My Reclamations
      {
        path: 'my-reclamations',
        name: 'my-reclamations-index',
        component: () => import('@/pages/reclamations/my-reclamations.vue'),
      },
      {
        path: 'my-reclamations/create',
        name: 'my-reclamations-create',
        component: () => import('@/pages/reclamations/my-reclamations/create.vue'),
      },
      {
        path: 'my-reclamations/:id',
        name: 'my-reclamations-detail',
        component: () => import('@/pages/reclamations/my-reclamations/detail.vue'),
        props: true,
      },
      {
        path: 'my-reclamations/:id/edit',
        name: 'my-reclamations-edit',
        component: () => import('@/pages/reclamations/my-reclamations/edit.vue'),
        props: true,
      },

      // Payments
      // --- Payments module routes ---
      {
        path: 'payments',
        name: 'payments-index',
        component: () => import('@/pages/payments/index.vue'),
      },
      {
        path: 'payments/create',
        name: 'payments-create',
        component: () => import('@/pages/payments/create.vue'),
      },
      {
        path: 'payments/:id',
        name: 'payments-detail',
        component: () => import('@/pages/payments/detail.vue'),
        props: true,
      },
      {
        path: 'payments/:id/edit',
        name: 'payments-edit',
        component: () => import('@/pages/payments/edit.vue'),
        props: true,
      },
      {
        path: 'payments/transaction/:transactionId',
        name: 'payments-by-transaction',
        component: () => import('@/pages/payments/by-transaction.vue'),
        props: true,
      },
      {
        path: 'payments/check-status/:transactionId',
        name: 'payments-check-status',
        component: () => import('@/pages/payments/check-status.vue'),
        props: true,
      },
      {
        path: 'payments/webhook/cinetpay',
        name: 'payments-cinetpay-webhook',
        component: () => import('@/pages/payments/webhook/cinetpay.vue'),
      },
      // Training
      // --- Training module routes ---
      {
        path: 'training',
        redirect: '/training/trainings',
      },
      // Trainings CRUD
      {
        path: 'training/trainings',
        name: 'training-trainings-index',
        component: () => import('@/pages/training/trainings/index.vue'),
      },
      {
        path: 'training/trainings/create',
        name: 'training-trainings-create',
        component: () => import('@/pages/training/trainings/create.vue'),
      },
      {
        path: 'training/trainings/:id',
        name: 'training-trainings-detail',
        component: () => import('@/pages/training/trainings/detail.vue'),
        props: true,
      },
      {
        path: 'training/trainings/:id/edit',
        name: 'training-trainings-edit',
        component: () => import('@/pages/training/trainings/edit.vue'),
        props: true,
      },
      // Sessions CRUD
      {
        path: 'training/sessions',
        name: 'training-sessions-index',
        component: () => import('@/pages/training/sessions/index.vue'),
      },
      {
        path: 'training/sessions/create',
        name: 'training-sessions-create',
        component: () => import('@/pages/training/sessions/create.vue'),
      },
      {
        path: 'training/sessions/:id',
        name: 'training-sessions-detail',
        component: () => import('@/pages/training/sessions/detail.vue'),
        props: true,
      },
      {
        path: 'training/sessions/:id/edit',
        name: 'training-sessions-edit',
        component: () => import('@/pages/training/sessions/edit.vue'),
        props: true,
      },
      // Applications CRUD
      {
        path: 'training/applications',
        name: 'training-applications-index',
        component: () => import('@/pages/training/applications/index.vue'),
      },
      {
        path: 'training/applications/:id',
        name: 'training-applications-detail',
        component: () => import('@/pages/training/applications/detail.vue'),
        props: true,
      },
      // Training Applications
      {
        path: 'training/applications/create',
        name: 'training-applications-create',
        component: () => import('@/pages/training/applications/create.vue'),
      },
      {
        path: 'training/applications/:trainingId/apply',
        name: 'training-application-create',
        component: () => import('@/pages/training/applications/create.vue'),
        meta: {
          title: 'Candidater à une formation',
          requiresAuth: false, // Public
        },
        props: true
      },
      {
        path: 'training/applications/success',
        name: 'training-application-success',
        component: () => import('@/pages/training/applications/success.vue'),
        meta: {
          title: 'Candidature soumise',
          requiresAuth: false, // Public
        }
      },
      // My Applications CRUD
      {
        path: 'training/my-applications',
        name: 'training-my-applications-index',
        component: () => import('@/pages/training/my-applications/index.vue'),
      },
      {
        path: 'training/my-applications/:id',
        name: 'training-my-applications-detail',
        component: () => import('@/pages/training/my-applications/detail.vue'),
        props: true,
      },
      // Training registrations routes
      {
        path: 'training/registrations/session/:id',
        name: 'training-session-register',
        component: () => import('@/pages/training/registrations/session-register.vue'),
        meta: {
          title: 'Inscription à une session',
          requiresAuth: false, // Public
        },
        props: true
      },
      {
        path: 'training/registrations/success',
        name: 'training-registration-success',
        component: () => import('@/pages/training/registrations/success.vue'),
        meta: {
          title: 'Inscription réussie',
          requiresAuth: false, // Public
        }
      },
      // Student Applications routes
      {
        path: 'student-applications',
        name: 'student-applications-index',
        component: () => import('@/pages/student-applications/index.vue'),
        meta: {
          title: 'Mes candidatures',
          requiresAuth: true,
        }
      },
      {
        path: 'student-applications/create',
        name: 'student-applications-create',
        component: () => import('@/pages/student-applications/create.vue'),
        meta: {
          title: 'Nouvelle candidature',
          requiresAuth: true,
        }
      },
      {
        path: 'student-applications/:id',
        name: 'student-applications-detail',
        component: () => import('@/pages/student-applications/detail.vue'),
        meta: {
          title: 'Détails de la candidature',
          requiresAuth: true,
        },
        props: true
      },
      // Specialties CRUD
      {
        path: 'training/specialties',
        name: 'training-specialties-index',
        component: () => import('@/pages/training/specialties/index.vue'),
      },
      {
        path: 'training/specialties/create',
        name: 'training-specialties-create',
        component: () => import('@/components/Training/Specialty/SpecialtyForm.vue'),
      },
      {
        path: 'training/specialties/:id/edit',
        name: 'training-specialties-edit',
        component: () => import('@/components/Training/Specialty/SpecialtyForm.vue'),
        props: (route: any) => ({ specialtyId: parseInt(route.params.id as string) }),
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

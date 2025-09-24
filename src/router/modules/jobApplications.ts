import type { RouteRecordRaw } from 'vue-router'

const jobApplicationsRoutes: RouteRecordRaw[] = [
  {
    path: '/job-applications',
    name: 'job-applications',
    redirect: '/job-applications/list',
    meta: {
      title: 'Candidatures',
      icon: 'ri-user-line',
      requiresAuth: true, // Admin seulement
      permissions: ['job_applications.view'],
      breadcrumb: [
        { text: 'Accueil', to: '/' },
        { text: 'Candidatures', to: '/job-applications' }
      ]
    },
    children: [
      // Liste des candidatures (admin)
      {
        path: 'list',
        name: 'job-applications-list',
        component: () => import('@/pages/jobs/JobApplications.vue'),
        meta: {
          title: 'Liste des candidatures',
          icon: 'ri-list-check',
          requiresAuth: true,
          permissions: ['job_applications.view'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Candidatures', to: '/job-applications' }
          ]
        }
      },

      // Détails d'une candidature (admin)
      {
        path: ':id',
        name: 'job-applications-detail',
        component: () => import('@/pages/jobs/JobApplicationDetail.vue'),
        meta: {
          title: 'Détails de la candidature',
          icon: 'ri-file-user-line',
          requiresAuth: true,
          permissions: ['job_applications.view'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Candidatures', to: '/job-applications' },
            { text: 'Détails', to: '' }
          ]
        },
        props: true
      },

      // Soumettre une candidature (public)
      {
        path: 'apply/:offerId',
        name: 'job-application-create',
        component: () => import('@/pages/job-applications/create.vue'),
        meta: {
          title: 'Soumettre une candidature',
          icon: 'ri-send-plane-line',
          requiresAuth: false, // Public
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' },
            { text: 'Candidater', to: '' }
          ]
        },
        props: true
      },

      // Page de succès après candidature
      {
        path: 'success',
        name: 'job-application-success',
        component: () => import('@/pages/job-applications/success.vue'),
        meta: {
          title: 'Candidature soumise',
          icon: 'ri-check-circle-line',
          requiresAuth: false,
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Candidature réussie', to: '' }
          ]
        }
      },

      // Modifier sa candidature avec OTP (public)
      {
        path: 'edit/:applicationNumber',
        name: 'job-application-edit',
        component: () => import('@/pages/job-applications/edit.vue'),
        meta: {
          title: 'Modifier ma candidature',
          icon: 'ri-edit-line',
          requiresAuth: false,
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Modifier ma candidature', to: '' }
          ]
        },
        props: true
      }
    ]
  }
]

export default jobApplicationsRoutes
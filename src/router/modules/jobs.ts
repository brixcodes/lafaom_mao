import type { RouteRecordRaw } from 'vue-router'

const jobsRoutes: RouteRecordRaw[] = [
  {
    path: '/jobs',
    name: 'jobs',
    redirect: '/jobs/offers',
    meta: {
      title: 'Emploi',
      icon: 'ri-briefcase-line',
      requiresAuth: false, // Les offres d'emploi sont publiques
      breadcrumb: [
        { text: 'Accueil', to: '/' },
        { text: 'Emploi', to: '/jobs' }
      ]
    },
    children: [
      // Liste des offres d'emploi
      {
        path: 'offers',
        name: 'job-offers-list',
        component: () => import('@/pages/jobs/JobOffersList.vue'),
        meta: {
          title: 'Offres d\'emploi',
          icon: 'ri-briefcase-line',
          requiresAuth: false,
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' }
          ]
        }
      },

      // Détails d'une offre d'emploi
      {
        path: 'offers/:id',
        name: 'job-offers-detail',
        component: () => import('@/pages/jobs/JobOfferDetail.vue'),
        meta: {
          title: 'Détails de l\'offre',
          icon: 'ri-file-text-line',
          requiresAuth: false,
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' },
            { text: 'Détails', to: '' }
          ]
        },
        props: true
      },

      // Candidater à une offre
      {
        path: 'offers/:id/apply',
        name: 'job-offers-apply',
        component: () => import('@/pages/jobs/JobOfferApply.vue'),
        meta: {
          title: 'Candidater',
          icon: 'ri-send-plane-line',
          requiresAuth: false,
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' },
            { text: 'Candidater', to: '' }
          ]
        },
        props: true
      },

      // Administration - Création d'offre
      {
        path: 'offers/create',
        name: 'job-offers-create',
        component: () => import('@/pages/jobs/JobOfferCreate.vue'),
        meta: {
          title: 'Créer une offre',
          icon: 'ri-add-line',
          requiresAuth: true,
          permissions: ['job_offers.create'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' },
            { text: 'Enregistrer', to: '' }
          ]
        }
      },

      // Administration - Modification d'offre
      {
        path: 'offers/:id/edit',
        name: 'job-offers-edit',
        component: () => import('@/pages/jobs/JobOfferEdit.vue'),
        meta: {
          title: 'Modifier l\'offre',
          icon: 'ri-edit-line',
          requiresAuth: true,
          permissions: ['job_offers.update'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Offres d\'emploi', to: '/jobs/offers' },
            { text: 'Modifier', to: '' }
          ]
        },
        props: true
      },

      // Administration - Gestion des candidatures
      {
        path: 'applications',
        name: 'job-applications',
        component: () => import('@/pages/jobs/JobApplications.vue'),
        meta: {
          title: 'Candidatures',
          icon: 'ri-file-user-line',
          requiresAuth: true,
          permissions: ['job_applications.view'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Candidatures', to: '/jobs/applications' }
          ]
        }
      },

      // Administration - Détails d'une candidature
      {
        path: 'applications/:id',
        name: 'job-applications-detail',
        component: () => import('@/pages/jobs/JobApplicationDetail.vue'),
        meta: {
          title: 'Détails de la candidature',
          icon: 'ri-file-user-line',
          requiresAuth: true,
          permissions: ['job_applications.view'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Candidatures', to: '/jobs/applications' },
            { text: 'Détails', to: '' }
          ]
        },
        props: true
      },

      // Administration - Statistiques
      {
        path: 'stats',
        name: 'job-stats',
        component: () => import('@/pages/job-offers/stats.vue'),
        meta: {
          title: 'Statistiques emploi',
          icon: 'ri-line-chart-line',
          requiresAuth: true,
          permissions: ['job_offers.view', 'job_applications.view'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Statistiques', to: '/jobs/stats' }
          ]
        }
      },

      // Administration - Paramètres
      {
        path: 'settings',
        name: 'job-settings',
        component: () => import('@/pages/jobs/JobSettings.vue'),
        meta: {
          title: 'Paramètres emploi',
          icon: 'ri-settings-line',
          requiresAuth: true,
          permissions: ['job_offers.manage'],
          breadcrumb: [
            { text: 'Accueil', to: '/' },
            { text: 'Emploi', to: '/jobs' },
            { text: 'Paramètres', to: '/jobs/settings' }
          ]
        }
      }
    ]
  }
]

export default jobsRoutes
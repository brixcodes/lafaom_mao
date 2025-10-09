import type { NavLink, NavGroup } from '@/@layouts/types'
import { trainingNav } from './training'

export const navigationItems: (NavLink | NavGroup)[] = [
  {
    title: 'Home',
    to: '/',
    icon: 'ri-home-line',
  },
  trainingNav,
  // Cabinet Applications
  {
    title: 'Candidatures Cabinet',
    icon: 'ri-building-line',
    children: [
      {
        title: 'Liste des candidatures',
        to: '/cabinet/applications',
        icon: 'ri-file-list-line',
      },
      {
        title: 'Nouvelle candidature',
        to: '/cabinet/applications/create',
        icon: 'ri-add-line',
      },
      {
        title: 'Candidatures payées',
        to: '/cabinet/applications/paid',
        icon: 'ri-money-euro-circle-line',
      },
    ],
  },
  // Add other navigation sections here
]

export default navigationItems

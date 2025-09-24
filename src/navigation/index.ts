import type { NavLink, NavGroup } from '@/@layouts/types'
import { trainingNav } from './training'

export const navigationItems: (NavLink | NavGroup)[] = [
  {
    title: 'Home',
    to: '/',
    icon: 'ri-home-line',
  },
  trainingNav,
  // Add other navigation sections here
]

export default navigationItems

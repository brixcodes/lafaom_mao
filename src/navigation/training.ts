import type { NavGroup } from '@/@layouts/types'

export const trainingNav: NavGroup = {
  title: 'Training',
  icon: 'ri-building-line',
  children: [
    {
      title: 'Trainings',
      icon: 'ri-book-line',
      children: [
        {
          title: 'Catalog',
          to: '/training/trainings',
        },
        {
          title: 'Sessions',
          to: '/training/sessions',
        },
        {
          title: 'Specialties',
          to: '/training/specialties',
        },
      ],
    },
    {
      title: 'Applications',
      icon: 'ri-file-list-line',
      children: [
        {
          title: 'All Applications',
          to: '/training/applications',
        },
        {
          title: 'My Applications',
          to: '/training/my-applications',
        },
      ],
    },
  ],
}

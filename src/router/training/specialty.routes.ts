import type { RouteRecordRaw } from 'vue-router'
import { hasPermission } from '@/plugins/casl'

const specialtyRoutes: RouteRecordRaw[] = [
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
    beforeEnter: [() => hasPermission('create', 'Training')],
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
    beforeEnter: [() => hasPermission('update', 'Training')],
  },
]

export default specialtyRoutes

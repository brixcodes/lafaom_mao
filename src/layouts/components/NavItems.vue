<script lang="ts" setup>
import { computed } from 'vue'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions, hasRole, hasUserType, isUserTypeAdmin, isUserTypeStaff, isUserTypeTeacher, isUserTypeStudent } = useInstantPermissions()

// Détermination du niveau d'accès
const accessLevel = computed(() => {
  if (isUserTypeAdmin.value) return 'admin'
  if (isUserTypeStaff.value) return 'staff'
  if (isUserTypeTeacher.value) return 'teacher'
  if (isUserTypeStudent.value) return 'student'
  return 'visitor'
})

// Accès par type
const canAccessAdminSections = computed(() => isUserTypeAdmin.value)
const canAccessStaffSections = computed(() => isUserTypeAdmin.value || isUserTypeStaff.value)
const canAccessTeacherSections = computed(() => isUserTypeAdmin.value || isUserTypeStaff.value || isUserTypeTeacher.value)
const canAccessStudentSections = computed(() => isUserTypeStudent.value)

// Sections spécifiques
const canManageUsers = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_USER, PermissionEnum.CAN_VIEW_ROLE]))
const canManageBlog = computed(() => canAccessStaffSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_BLOG]))
const canManageJobs = computed(() => canAccessStaffSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_JOB_OFFER]))
const canManageCenters = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_ORGANIZATION_CENTER]))
const canManageSpecialties = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_SPECIALTY]))
const canManageReclamations = computed(() => canAccessStaffSections.value)
const canViewPayments = computed(() => canAccessStaffSections.value)

// Données utilisateur
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const user = computed(() => authStore.user)
const userFullName = computed(() => authStore.userFullName)
const userEmail = computed(() => authStore.userEmail)

// Exclure le compte marketing
const isMarketingUser = computed(() => userEmail.value === 'marketing@lafaom.com')

console.log("User email: ", userEmail.value)
console.log("Nom complet: ", userFullName.value)
</script>

<template>
  <!-- DASHBOARD -->
  <VerticalNavGroup
    v-if="!isMarketingUser && canAccessAdminSections"
    :item="{ title: 'Dashboard', icon: 'ri-home-smile-line' }"
  >
    <VerticalNavLink :item="{ title: 'Analytics', to: '/dashboard' }" />
  </VerticalNavGroup>

  <!-- ADMINISTRATION -->
  <VerticalNavSectionTitle
    v-if="!isMarketingUser && canAccessAdminSections"
    :item="{ heading: 'Administration' }"
  />

  <VerticalNavGroup
    v-if="!isMarketingUser && canManageUsers"
    :item="{ title: 'Utilisateurs', icon: 'ri-group-line' }"
  >
    <VerticalNavLink
      v-if="hasPermission(PermissionEnum.CAN_VIEW_USER)"
      :item="{ title: 'Liste des utilisateurs', to: '/users' }"
    />
    <VerticalNavLink
      v-if="hasPermission(PermissionEnum.CAN_VIEW_ROLE)"
      :item="{ title: 'Rôles & Permissions', to: '/users/role-permissions' }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser && canManageCenters"
    :item="{ title: 'Centres', icon: 'ri-building-line' }"
  >
    <VerticalNavLink :item="{ title: 'Gestion des centres', to: '/organization-centers' }" />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser && canManageSpecialties"
    :item="{ title: 'Spécialités', icon: 'ri-award-line' }"
  >
    <VerticalNavLink :item="{ title: 'Gestion des spécialités', to: '/specialties' }" />
  </VerticalNavGroup>

  <!-- GESTION -->
  <VerticalNavSectionTitle v-if="!isMarketingUser && canAccessStaffSections" :item="{ heading: 'Gestion' }" />

  <VerticalNavGroup
    v-if="!isMarketingUser && canManageBlog"
    :item="{ title: 'Blog', icon: 'ri-article-line' }"
  >
    <VerticalNavLink :item="{ title: 'Catégories', to: '/blog/categories' }" />
    <VerticalNavLink :item="{ title: 'Articles', to: '/blog/posts' }" />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser && canManageJobs"
    :item="{ title: 'Emploi', icon: 'ri-briefcase-line' }"
  >
    <VerticalNavLink :item="{ title: 'Offres d\'emploi', to: '/jobs/offers' }" />
    <VerticalNavLink
      v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_APPLICATION])"
      :item="{ title: 'Candidatures', to: '/jobs/applications' }"
    />
    <VerticalNavLink
      v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_OFFER])"
      :item="{ title: 'Statistiques', to: '/jobs/stats' }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser && canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_APPLICATION])"
    :item="{ title: 'Candidatures Cabinet', icon: 'ri-building-line' }"
  >
    <VerticalNavLink :item="{ title: 'Liste des candidatures', to: '/cabinet/applications' }" />
    <VerticalNavLink :item="{ title: 'Nouvelle candidature', to: '/cabinet/applications/create' }" />
    <VerticalNavLink :item="{ title: 'Candidatures payées', to: '/cabinet/applications/paid' }" />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser"
    :item="{ title: 'Réclamations', icon: 'ri-file-text-line' }"
  >
    <VerticalNavLink
      v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_CHANGE_RECLAMATION_STATUS])"
      :item="{ title: 'Toutes les réclamations', to: '/reclamations' }"
    />
    <VerticalNavLink :item="{ title: 'Mes réclamations', to: '/my-reclamations' }" />
    <VerticalNavLink
      v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_RECLAMATION_TYPE])"
      :item="{ title: 'Types de réclamation', to: '/reclamations/types' }"
    />
  </VerticalNavGroup>

  <!-- FORMATIONS -->
  <VerticalNavSectionTitle v-if="!isMarketingUser && canAccessTeacherSections" :item="{ heading: 'Formations' }" />
  <VerticalNavGroup
    v-if="!isMarketingUser && canAccessTeacherSections"
    :item="{ title: 'Formations', icon: 'ri-graduation-cap-line' }"
  >
    <VerticalNavLink :item="{ title: 'Catalogue', to: '/training/trainings' }" />
    <VerticalNavLink :item="{ title: 'Sessions', to: '/training/sessions' }" />
    <VerticalNavLink :item="{ title: 'Spécialités', to: '/training/specialties' }" />
  </VerticalNavGroup>

  <!-- ÉTUDIANTS -->
  <VerticalNavSectionTitle v-if="isMarketingUser" :item="{ heading: 'Mes Formations' }" />
  <VerticalNavGroup
    v-if="isMarketingUser"
    :item="{ title: 'Candidatures', icon: 'ri-file-list-3-line' }"
  >
    <VerticalNavLink :item="{ title: 'Toutes les candidatures', to: '/student-applications' }" />
    <VerticalNavLink v-if="!isMarketingUser" :item="{ title: 'Mes candidatures', to: '/my-student-applications' }" />
  </VerticalNavGroup>

  <VerticalNavGroup
    v-if="!isMarketingUser && canAccessStudentSections"
    :item="{ title: 'Emploi', icon: 'ri-briefcase-line' }"
  >
    <VerticalNavLink :item="{ title: 'Offres d\'emploi', to: '/jobs/offers' }" />
    <VerticalNavLink :item="{ title: 'Mes candidatures d\'emploi', to: '/jobs/applications/my-applications' }" />
  </VerticalNavGroup>

  <!-- COMPTE (toujours visible) -->
  <VerticalNavSectionTitle :item="{ heading: 'Compte' }" />
  <VerticalNavLink :item="{ title: 'Mon Profil', icon: 'ri-user-settings-line', to: '/profile' }" />
</template>

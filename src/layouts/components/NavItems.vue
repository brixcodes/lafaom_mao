<script lang="ts" setup>
import { computed } from 'vue'
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions, hasRole, hasUserType, isUserTypeAdmin, isUserTypeStaff, isUserTypeTeacher, isUserTypeStudent } = useInstantPermissions()

// Computed pour déterminer le niveau d'accès
const accessLevel = computed(() => {
  if (isUserTypeAdmin.value) return 'admin'
  if (isUserTypeStaff.value) return 'staff'
  if (isUserTypeTeacher.value) return 'teacher'
  if (isUserTypeStudent.value) return 'student'
  return 'visitor'
})

// Computed pour les sections accessibles par type d'utilisateur
const canAccessAdminSections = computed(() => isUserTypeAdmin.value)
const canAccessStaffSections = computed(() => isUserTypeAdmin.value || isUserTypeStaff.value)
const canAccessTeacherSections = computed(() => isUserTypeAdmin.value || isUserTypeStaff.value || isUserTypeTeacher.value)
const canAccessStudentSections = computed(() => isUserTypeStudent.value)

// Computed pour les sections spécifiques
const canManageUsers = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_USER, PermissionEnum.CAN_VIEW_ROLE]))
const canManageBlog = computed(() => canAccessStaffSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_BLOG]))
const canManageJobs = computed(() => canAccessStaffSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_JOB_OFFER]))
const canManageCenters = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_ORGANIZATION_CENTER]))
const canManageSpecialties = computed(() => canAccessAdminSections.value && hasPermissions.value([PermissionEnum.CAN_VIEW_SPECIALTY]))
const canManageReclamations = computed(() => canAccessStaffSections.value)
const canViewPayments = computed(() => canAccessStaffSections.value)

</script>

<!-- v-if="canView('user') || canCreate('user') || canUpdate('user') || canDelete('user') || canManagePermissions | -->

<template>
  <!-- ============================================ -->
  <!-- SECTION 1: DASHBOARD (Accessible à tous) -->
  <!-- ============================================ -->
  <VerticalNavGroup v-if="canAccessAdminSections" :item="{
    title: 'Dashboard',
    icon: 'ri-home-smile-line',
  }">
    <VerticalNavLink :item="{
      title: 'Analytics',
      to: '/dashboard',
    }" />
  </VerticalNavGroup>


  <!-- ============================================ -->
  <!-- SECTION 2: ADMINISTRATION (Admin uniquement) -->
  <!-- ============================================ -->
  <VerticalNavSectionTitle v-if="canAccessAdminSections" :item="{ heading: 'Administration' }" />

  <!-- Gestion des Utilisateurs -->
  <VerticalNavGroup v-if="canManageUsers" :item="{
    title: 'Utilisateurs',
    icon: 'ri-group-line',
  }">
    <VerticalNavLink v-if="hasPermission(PermissionEnum.CAN_VIEW_USER)" :item="{
      title: 'Liste des utilisateurs',
      to: '/users',
    }" />
    <VerticalNavLink v-if="hasPermission(PermissionEnum.CAN_VIEW_ROLE)" :item="{
      title: 'Rôles & Permissions',
      to: '/users/role-permissions',
    }" />
  </VerticalNavGroup>

  <!-- Centres d'Organisation -->
  <VerticalNavGroup v-if="canManageCenters" :item="{
    title: 'Centres',
    icon: 'ri-building-line',
  }">
    <VerticalNavLink :item="{
      title: 'Gestion des centres',
      to: '/organization-centers',
    }" />
  </VerticalNavGroup>

  <!-- Spécialités -->
  <VerticalNavGroup v-if="canManageSpecialties" :item="{
    title: 'Spécialités',
    icon: 'ri-award-line',
  }">
    <VerticalNavLink :item="{
      title: 'Gestion des spécialités',
      to: '/specialties',
    }" />
  </VerticalNavGroup>

  <!-- ============================================ -->
  <!-- SECTION 3: GESTION (Admin + Staff) -->
  <!-- ============================================ -->
  <VerticalNavSectionTitle v-if="canAccessStaffSections" :item="{ heading: 'Gestion' }" />

  <!-- Blog -->
  <VerticalNavGroup v-if="canManageBlog" :item="{
    title: 'Blog',
    icon: 'ri-article-line',
  }">
    <VerticalNavLink :item="{
      title: 'Catégories',
      to: '/blog/categories',
    }" />
    <VerticalNavLink :item="{
      title: 'Articles',
      to: '/blog/posts',
    }" />
  </VerticalNavGroup>

  <!-- Emploi -->
  <VerticalNavGroup v-if="canManageJobs" :item="{
    title: 'Emploi',
    icon: 'ri-briefcase-line',
  }">
    <VerticalNavLink :item="{
      title: 'Offres d\'emploi',
      to: '/jobs/offers',
    }" />
    <VerticalNavLink v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_APPLICATION])" :item="{
      title: 'Candidatures',
      to: '/jobs/applications',
    }" />
    <VerticalNavLink v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_OFFER])" :item="{
      title: 'Statistiques',
      to: '/jobs/stats',
    }" />
  </VerticalNavGroup>

  <!-- Candidatures Cabinet -->
  <VerticalNavGroup v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_JOB_APPLICATION])" :item="{
    title: 'Candidatures Cabinet',
    icon: 'ri-building-line',
  }">
    <VerticalNavLink :item="{
      title: 'Liste des candidatures',
      to: '/cabinet/applications',
    }" />
    <VerticalNavLink :item="{
      title: 'Nouvelle candidature',
      to: '/cabinet/applications/create',
    }" />
    <VerticalNavLink :item="{
      title: 'Candidatures payées',
      to: '/cabinet/applications/paid',
    }" />
  </VerticalNavGroup>

  <!-- Réclamations -->
  <VerticalNavGroup :item="{
    title: 'Réclamations',
    icon: 'ri-file-text-line',
  }">
    <VerticalNavLink v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_CHANGE_RECLAMATION_STATUS])"
      :item="{
        title: 'Toutes les réclamations',
        to: '/reclamations',
      }" />
    <VerticalNavLink :item="{
      title: 'Mes réclamations',
      to: '/my-reclamations',
    }" />
    <VerticalNavLink v-if="canAccessAdminSections && hasPermissions([PermissionEnum.CAN_VIEW_RECLAMATION_TYPE])" :item="{
      title: 'Types de réclamation',
      to: '/reclamations/types',
    }" />
  </VerticalNavGroup>

  <!-- Paiements -->
  <!-- <VerticalNavGroup v-if="canViewPayments" :item="{
    title: 'Paiements',
    icon: 'ri-money-dollar-circle-line',
  }">
    <VerticalNavLink :item="{
      title: 'Liste des paiements',
      to: '/payments',
    }" />
  </VerticalNavGroup> -->

  <!-- ============================================ -->
  <!-- SECTION 4: FORMATIONS (Tous sauf étudiants) -->
  <!-- ============================================ -->
  <VerticalNavSectionTitle v-if="canAccessTeacherSections" :item="{ heading: 'Formations' }" />

  <VerticalNavGroup v-if="canAccessTeacherSections" :item="{
    title: 'Formations',
    icon: 'ri-graduation-cap-line',
  }">
    <VerticalNavLink :item="{
      title: 'Catalogue',
      to: '/training/trainings',
    }" />
    <VerticalNavLink :item="{
      title: 'Sessions',
      to: '/training/sessions',
    }" />
    <VerticalNavLink :item="{
      title: 'Spécialités',
      to: '/training/specialties',
    }" />
  </VerticalNavGroup>

  <!-- ============================================ -->
  <!-- SECTION 5: ÉTUDIANTS (Étudiants uniquement) -->
  <!-- ============================================ -->
  <VerticalNavSectionTitle  :item="{ heading: 'Mes Formations' }" />

  <!-- Candidatures d'Étudiants -->
  <VerticalNavGroup  :item="{
    title: 'Candidatures',
    icon: 'ri-file-list-3-line',
  }">
    <VerticalNavLink :item="{
      title: 'Toutes les candidatures',
      to: '/student-applications',
    }" />
    <VerticalNavLink  :item="{
      title: 'Mes candidatures',
      to: '/my-student-applications',
    }" />
  </VerticalNavGroup>

  <!-- Candidature Cabinet (pour tous) -->
  <!-- <VerticalNavGroup :item="{
    title: 'Cabinet',
    icon: 'ri-building-line',
  }">
    <VerticalNavLink :item="{
      title: 'Mes candidatures Cabinet',
      to: '/cabinet/applications/my-applications',
    }" />
    <VerticalNavLink :item="{
      title: 'Mes candidatures Cabinet',
      to: '/cabinet/applications/my-applications',
    }" />
    <VerticalNavLink :item="{
      title: 'Mes candidatures Cabinet',
      to: '/cabinet/applications/my-applications',
    }" />
    <VerticalNavLink :item="{
      title: 'Nouvelle candidature',
      to: '/cabinet/applications/create',
    }" />
  </VerticalNavGroup> -->

  <!-- Candidatures d'Emploi -->
  <VerticalNavGroup v-if="canAccessStudentSections" :item="{
    title: 'Emploi',
    icon: 'ri-briefcase-line',
  }">
    <VerticalNavLink :item="{
      title: 'Offres d\'emploi',
      to: '/jobs/offers',
    }" />
    <VerticalNavLink :item="{
      title: 'Mes candidatures d\'emploi',
      to: '/jobs/applications/my-applications',
    }" />
  </VerticalNavGroup>

  <!-- ============================================ -->
  <!-- SECTION 6: PROFIL (Accessible à tous) -->
  <!-- ============================================ -->
  <VerticalNavSectionTitle :item="{ heading: 'Compte' }" />

  <VerticalNavLink :item="{
    title: 'Mon Profil',
    icon: 'ri-user-settings-line',
    to: '/profile',
  }" />
</template>

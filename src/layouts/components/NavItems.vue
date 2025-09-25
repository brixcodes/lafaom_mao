<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <!-- 👉 Dashboard -->
  <VerticalNavGroup :item="{
    title: 'Dashboard',
    icon: 'ri-home-smile-line',
  }">
    <VerticalNavLink :item="{
      title: 'Analytics',
      to: '/dashboard',
    }" />
  </VerticalNavGroup>

  <!-- Utilisateurs -->
  <VerticalNavGroup :item="{
    title: 'Utilisateurs',
    icon: 'ri-group-line',
  }">
    <VerticalNavLink :item="{
      title: 'Utilisateurs',
      to: '/users',
    }" />

    <VerticalNavLink :item="{
      title: 'Permissions',
      to: '/permissions',
    }" />

    <!-- <VerticalNavLink :item="{
      title: 'Rôles & Permissions',
      to: '/users/role-permissions',
    }" /> -->
  </VerticalNavGroup>

  <!-- Blog -->
  <VerticalNavGroup :item="{
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
  <VerticalNavGroup :item="{
    title: 'Emploi',
    icon: 'ri-briefcase-line',
  }">
    <VerticalNavLink :item="{
      title: 'Offres d\'emploi',
      to: '/jobs/offers',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Candidatures',
      to: '/jobs/applications',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Mes candidatures',
      to: '/jobs/applications/my-applications',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Statistiques',
      to: '/jobs/stats',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- Centres d'Organisation -->
  <VerticalNavGroup :item="{
    title: 'Centres',
    icon: 'ri-building-line',
  }">
    <VerticalNavLink :item="{
      title: 'centres',
      to: '/organization-centers',
      icon: '',
    }" />

  </VerticalNavGroup>

  <!-- Spécialités -->
  <VerticalNavGroup :item="{
    title: 'Spécialités',
    icon: 'ri-award-line',
  }">
    <VerticalNavLink :item="{
      title: 'spécialités',
      to: '/specialties',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- Candidatures d'Étudiants -->
  <VerticalNavGroup :item="{
    title: 'Candidatures',
    icon: 'ri-file-list-3-line',
  }">
    <VerticalNavLink :item="{
      title: 'candidatures',
      to: '/student-applications',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Mes candidatures',
      to: '/my-student-applications',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- Formations -->
  <VerticalNavGroup :item="{
    title: 'Formations',
    icon: 'ri-graduation-cap-line',
  }">
    <VerticalNavLink :item="{
      title: 'Catalogue',
      to: '/training/trainings',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Sessions',
      to: '/training/sessions',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Spécialités',
      to: '/training/specialties',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- Réclamations -->
  <VerticalNavGroup :item="{
    title: 'Réclamations',
    icon: 'ri-file-text-line',
  }">
    <VerticalNavLink :item="{
      title: 'Toutes les réclamations',
      to: '/reclamations',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Mes réclamations',
      to: '/my-reclamations',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Types de réclamation',
      to: '/reclamations/types',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- Paiements -->
  <VerticalNavGroup :item="{
    title: 'Paiements',
    icon: 'ri-money-dollar-circle-line',
  }">
    <VerticalNavLink :item="{
      title: 'Liste des paiements',
      to: '/payments',
      icon: '',
    }" />

    <VerticalNavLink :item="{
      title: 'Nouveau paiement',
      to: '/payments/init',
      icon: '',
    }" />
  </VerticalNavGroup>

  <!-- 👉 Profil -->
  <VerticalNavLink :item="{
    title: 'Mon Profil',
    icon: 'ri-user-settings-line',
    to: '/profile',
  }" />
</template>

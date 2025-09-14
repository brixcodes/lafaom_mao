
<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <!-- 👉 Dashboard -->
  <VerticalNavGroup
    :item="{
      title: 'Dashboard',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    :item="{
      title: 'Utilisateurs',
      icon: 'ri-group-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Utilisateurs',
        to: '/users',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Permissions',
        to: '/permissions',
      }"
    />
  </VerticalNavGroup>

  
  <VerticalNavGroup
    :item="{
      title: 'Blog',
      icon: 'ri-article-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Catégories',
        to: '/blog/categories',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Articles',
        to: '/blog/posts',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    :item="{
      title: 'Emplois',
      icon: 'ri-briefcase-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Toutes les offres',
        to: '/job-offers',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Créer une offre',
        to: '/job-offers/create',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Candidatures',
        to: '/job-offers/applications',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavGroup
    :item="{
      title: 'Formations',
      icon: 'ri-graduation-cap-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Toutes les formations',
        to: '/training/trainings',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Créer une formation',
        to: '/training/trainings/create',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Sessions',
        to: '/training/sessions',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Candidatures',
        to: '/training/applications',
      }"
    />
  </VerticalNavGroup>

  <VerticalNavLink
    :item="{
      title: 'Paiements',
      icon: 'ri-money-dollar-circle-line',
      to: '/payments',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Connexion',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Inscription',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
</template>

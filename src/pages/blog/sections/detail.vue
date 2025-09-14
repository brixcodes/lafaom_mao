<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'

const route = useRoute()
const router = useRouter()
const section = ref<any>(null)
const sectionId = Number(route.params.id)
const isLoading = ref(false)

const fetchSection = async () => {
  isLoading.value = true
  try {
    const res = await blogService.getSectionById(sectionId)
    section.value = res.data
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSection)
</script>

<template>
  <div class="section-detail-page">
    <h1 class="font-weight-bold mb-1">Détail section</h1>
    <VCard v-if="section">
      <VCardTitle>{{ section.title }}</VCardTitle>
      <VCardText>
        <div><strong>Slug :</strong> {{ section.slug }}</div>
      </VCardText>
      <VCardActions>
        <VBtn color="secondary" @click="router.push('/blog/sections')">Retour</VBtn>
      </VCardActions>
    </VCard>
    <VCard v-else>
      <VCardText>Chargement...</VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.section-detail-page {
  padding: 2rem;
}
</style>

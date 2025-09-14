<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { blogService } from '@/services/api/blog'
import { useRouter } from 'vue-router'

const router = useRouter()
const sections = ref<any[]>([])
const isLoading = ref(false)

const fetchSections = async () => {
  isLoading.value = true
  try {
    const res = await blogService.getSections()
    sections.value = res.data
  } finally {
    isLoading.value = false
  }
}

const goToDetail = (section: any) => {
  router.push(`/blog/sections/${section.id}`)
}

onMounted(fetchSections)
</script>

<template>
  <div class="section-list-page">
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">Sections du blog</h1>
        <p class="text-body-1 text-medium-emphasis">Gérez toutes les sections du blog</p>
      </div>
      <VBtn color="primary" prepend-icon="ri-add-line" @click="router.push('/blog/sections/create')">Nouvelle section</VBtn>
    </div>
    <VCard>
      <VCardText>
        <VTable
          :items="sections"
          :headers="[
            { title: 'Titre', key: 'title' },
            { title: 'Slug', key: 'slug' },
            { title: 'Actions', key: 'actions', sortable: false }
          ]"
          :loading="isLoading"
          @row-click="goToDetail"
        />
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.section-list-page {
  padding: 2rem;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'

const router = useRouter()
const isLoading = ref(false)
const form = ref({
  title: '',
  slug: '',
})

const handleCreate = async () => {
  isLoading.value = true
  try {
    await blogService.createSection(form.value)
    router.push('/blog/sections')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="section-create-page">
    <h1 class="font-weight-bold mb-1">Créer une section</h1>
    <VForm @submit.prevent="handleCreate">
      <VTextField v-model="form.title" label="Titre" required clearable class="mb-4" />
      <VTextField v-model="form.slug" label="Slug" required clearable class="mb-4" />
      <div class="d-flex gap-2">
        <VBtn color="primary" type="submit" :loading="isLoading">Créer</VBtn>
        <VBtn color="secondary" @click="router.push('/blog/sections')">Annuler</VBtn>
      </div>
    </VForm>
  </div>
</template>

<style scoped>
.section-create-page {
  padding: 2rem;
}
</style>

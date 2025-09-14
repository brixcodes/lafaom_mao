<template>
  <div class="section-manager">
    <!-- Header avec titre et bouton d'ajout -->
    <VCard class="mb-6" elevation="1">
      <VCardTitle class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <VIcon color="primary" class="me-3" size="28">ri-file-list-3-line</VIcon>
          <div>
            <h3 class="text-h5 mb-1">Sections de l'article</h3>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ sections.length }} section{{ sections.length > 1 ? 's' : '' }} • 
              Gérez le contenu et l'ordre de vos sections
            </p>
          </div>
        </div>
        
        <VBtn
          color="primary"
          prepend-icon="ri-add-line"
          @click="showCreateForm"
          :disabled="isLoading"
        >
          Ajouter une section
        </VBtn>
      </VCardTitle>
    </VCard>

    <!-- Formulaire de création de section -->
    <VExpandTransition>
      <VCard v-if="isCreateFormVisible" class="mb-6 create-form-card" elevation="3">
        <VCardTitle class="d-flex align-center pa-4">
          <VIcon color="success" class="me-2">ri-add-circle-line</VIcon>
          <span class="text-h6">Nouvelle section</span>
        </VCardTitle>
        
        <VDivider />
        
        <VCardText class="pa-4">
          <VForm @submit.prevent="handleCreate">
            <VRow>
              <VCol cols="12" md="8">
                <VTextField
                  v-model="createForm.title"
                  label="Titre de la section"
                  variant="outlined"
                  :error-messages="createErrors.title"
                  class="mb-3"
                  clearable
                />
                
                <VTextarea
                  v-model="createForm.content"
                  label="Contenu"
                  variant="outlined"
                  rows="6"
                  auto-grow
                  :error-messages="createErrors.content"
                  class="mb-3"
                  clearable
                />
              </VCol>
              
              <VCol cols="12" md="4">
                <VTextField
                  v-model.number="createForm.position"
                  label="Position"
                  type="number"
                  variant="outlined"
                  min="1"
                  :error-messages="createErrors.position"
                  class="mb-3"
                />
                
                <VFileInput
                  v-model="createForm.cover_image"
                  label="Image de couverture (optionnelle)"
                  accept="image/*"
                  variant="outlined"
                  prepend-icon=""
                  prepend-inner-icon="ri-image-line"
                  :error-messages="createErrors.cover_image"
                  show-size
                />
              </VCol>
            </VRow>
            
            <div class="d-flex gap-3 justify-end mt-4">
              <VBtn
                variant="outlined"
                @click="hideCreateForm"
                :disabled="isCreating"
              >
                Annuler
              </VBtn>
              <VBtn
                type="submit"
                color="primary"
                :loading="isCreating"
              >
                Créer la section
              </VBtn>
            </div>
          </VForm>
        </VCardText>
      </VCard>
    </VExpandTransition>

    <!-- État de chargement -->
    <div v-if="isLoading && sections.length === 0" class="text-center py-8">
      <VProgressCircular indeterminate color="primary" size="48" />
      <div class="text-body-1 mt-3">Chargement des sections...</div>
    </div>

    <!-- Liste des sections -->
    <VFadeTransition group>
      <SectionCard
        v-for="(section, index) in sortedSections"
        :key="section.id"
        :section="section"
        :is-first="index === 0"
        :is-last="index === sortedSections.length - 1"
        @update="(data) => handleSectionUpdate(section.id, data)"
        @delete="handleSectionDelete(section.id)"
        @move-up="handleSectionMoveUp(section)"
        @move-down="handleSectionMoveDown(section)"
      />
    </VFadeTransition>

    <!-- État vide -->
    <VCard v-if="!isLoading && sections.length === 0" class="text-center pa-8" elevation="1">
      <VIcon size="64" color="grey-lighten-2" class="mb-4">ri-file-list-3-line</VIcon>
      <h4 class="text-h6 mb-2">Aucune section</h4>
      <p class="text-body-2 text-medium-emphasis mb-4">
        Commencez par ajouter des sections pour structurer votre article
      </p>
      <VBtn
        color="primary"
        variant="outlined"
        prepend-icon="ri-add-line"
        @click="showCreateForm"
      >
        Créer la première section
      </VBtn>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import SectionCard from './SectionCard.vue'
import type { PostSectionOut, PostSectionCreateInput } from '@/types/blog'

const props = defineProps<{ postId: number }>()
const sections = ref<PostSectionOut[]>([])
const isLoading = ref(false)
const isCreateFormVisible = ref(false)
const isCreating = ref(false)

const createForm = ref({
  title: '',
  content: '',
  position: 1,
  cover_image: null as File | null,
})

const createErrors = ref({
  title: '',
  content: '',
  position: '',
  cover_image: '',
})

// === COMPUTED ===
const sortedSections = computed(() => {
  return [...sections.value].sort((a, b) => a.position - b.position)
})

const nextPosition = computed(() => {
  return sections.value.length > 0 ? Math.max(...sections.value.map(s => s.position)) + 1 : 1
})

// === FETCH SECTIONS ===
const fetchSections = async () => {
  if (!props.postId) {
    console.error('[DEBUG] postId est requis pour charger les sections')
    return
  }
  
  isLoading.value = true
  try {
    const res = await blogService.getPostSections(props.postId)
    sections.value = res.data || []
  } catch (error: any) {
    showToast({ message: 'Erreur lors du chargement des sections', type: 'error' })
    console.error('[DEBUG] Exception API:', error)
    sections.value = []
  } finally {
    isLoading.value = false
  }
}

// === CREATE SECTION ===
const validateCreateForm = () => {
  clearCreateErrors()
  let isValid = true
  
  if (!createForm.value.title.trim()) {
    createErrors.value.title = 'Le titre est requis'
    isValid = false
  }
  
  if (!createForm.value.content.trim()) {
    createErrors.value.content = 'Le contenu est requis'
    isValid = false
  }
  
  if (createForm.value.position < 1) {
    createErrors.value.position = 'La position doit être un nombre positif'
    isValid = false
  }
  
  return isValid
}

const clearCreateErrors = () => {
  Object.keys(createErrors.value).forEach(key => {
    createErrors.value[key as keyof typeof createErrors.value] = ''
  })
}

const showCreateForm = () => {
  resetCreateForm()
  createForm.value.position = nextPosition.value
  isCreateFormVisible.value = true
}

const hideCreateForm = () => {
  isCreateFormVisible.value = false
  clearCreateErrors()
}

const resetCreateForm = () => {
  createForm.value = {
    title: '',
    content: '',
    position: nextPosition.value,
    cover_image: null,
  }
}

const handleCreate = async () => {
  if (!validateCreateForm()) return
  
  isCreating.value = true
  try {
    const createData: PostSectionCreateInput = {
      title: createForm.value.title,
      content: createForm.value.content,
      position: createForm.value.position,
      post_id: props.postId,
      cover_image: createForm.value.cover_image || undefined,
    }
    
    await blogService.createSection(createData)
    showToast({ message: '✅ Section ajoutée avec succès', type: 'success' })
    await fetchSections()
    hideCreateForm()
  } catch (err: any) {
    if (err?.response?.status === 422 && err?.response?.data?.error) {
      const backendErrors: Record<string, string> = {}
      err.response.data.error.forEach((e: any) => {
        if (e.loc && e.loc.length > 0 && e.msg) {
          const field = e.loc[e.loc.length - 1]
          backendErrors[field] = e.msg
        }
      })
      Object.assign(createErrors.value, backendErrors)
      showToast({ message: '❌ Erreur de validation. Vérifiez vos champs.', type: 'error' })
    } else {
      showToast({ message: '⚠️ Erreur serveur ou réseau.', type: 'error' })
    }
    console.error('[DEBUG] Exception API:', err)
  } finally {
    isCreating.value = false
  }
}

// === UPDATE SECTION ===
const handleSectionUpdate = async (sectionId: number, updateData: any) => {
  try {
    await blogService.updateSection(sectionId, updateData)
    showToast({ message: '✅ Section modifiée avec succès', type: 'success' })
    await fetchSections()
  } catch (err: any) {
    showToast({ message: '❌ Erreur lors de la modification', type: 'error' })
    console.error('[DEBUG] Exception API:', err)
  }
}

// === DELETE SECTION ===
const handleSectionDelete = async (sectionId: number) => {
  const confirmed = await confirmAction({
    title: 'Supprimer la section',
    text: 'Cette action est irréversible. Voulez-vous continuer ?',
    confirmButtonText: 'Oui, supprimer',
    confirmButtonColor: 'error',
  })
  
  if (!confirmed) return
  
  try {
    await blogService.deleteSection(sectionId)
    showToast({ message: '✅ Section supprimée avec succès', type: 'success' })
    await fetchSections()
  } catch (error: any) {
    showToast({ message: '⚠️ Erreur lors de la suppression', type: 'error' })
    console.error('[DEBUG] Exception API:', error)
  }
}

// === MOVE SECTIONS ===
const handleSectionMoveUp = async (section: PostSectionOut) => {
  const currentIndex = sortedSections.value.findIndex(s => s.id === section.id)
  if (currentIndex <= 0) return
  
  const previousSection = sortedSections.value[currentIndex - 1]
  
  // Échanger les positions
  await Promise.all([
    handleSectionUpdate(section.id, { ...section, position: previousSection.position }),
    handleSectionUpdate(previousSection.id, { ...previousSection, position: section.position }),
  ])
}

const handleSectionMoveDown = async (section: PostSectionOut) => {
  const currentIndex = sortedSections.value.findIndex(s => s.id === section.id)
  if (currentIndex >= sortedSections.value.length - 1) return
  
  const nextSection = sortedSections.value[currentIndex + 1]
  
  // Échanger les positions
  await Promise.all([
    handleSectionUpdate(section.id, { ...section, position: nextSection.position }),
    handleSectionUpdate(nextSection.id, { ...nextSection, position: section.position }),
  ])
}

// === LIFECYCLE ===
onMounted(() => {
  fetchSections()
})
</script>

<style scoped>
.section-manager {
  width: 100%;
}

.create-form-card {
  border-radius: 12px;
  border: 2px solid rgb(var(--v-theme-success));
  background-color: rgba(var(--v-theme-success), 0.02);
}

.create-form-card .v-card-title {
  background-color: rgba(var(--v-theme-success), 0.08);
}
</style>
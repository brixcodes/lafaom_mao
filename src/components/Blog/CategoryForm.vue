<script setup lang="ts">
import { computed, ref } from 'vue'
import { validateRequired, validateMinLength } from '@/utils/validation'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ title: '', slug: '', description: '' }),
  },
  submitLabel: {
    type: String,
    default: 'Enregistrer',
  },
})
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Local state
const isSubmitting = ref(false)

// Proxy réactif : permet d'écrire directement v-model="form.title"
const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// ✅ Règles personnalisées
const titleRules = [
  (v: string) => {
    const res = validateRequired(v, 'Titre de la catégorie')
    return res.valid ? true : 'Veuillez renseigner un titre pour la catégorie.'
  },
  (v: string) => {
    const res = validateMinLength(v, 2, 'Titre de la catégorie')
    return res.valid ? true : 'Le titre doit contenir au moins 2 caractères.'
  },
  (v: string) => {
    if (!v) return true
    if (v.length > 50) return 'Le titre ne peut pas dépasser 50 caractères.'
    return true
  },
]

const descriptionRules = [
  (v: string) => {
    if (!v) return true
    const res = validateMinLength(v, 3, 'Description')
    return res.valid ? true : 'La description doit contenir au moins 3 caractères.'
  },
  (v: string) => {
    if (!v) return true
    if (v.length > 200) return 'La description ne peut pas dépasser 200 caractères.'
    return true
  },
]

// Fonction pour générer un slug à partir du titre
const generateSlug = (title: string): string => {
  if (!title) return ''

  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement les lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Supprime les tirets multiples
    .trim()
}

const clearForm = () => {
  form.value = { title: '', slug: '', description: '' }
  emit('cancel') // ✅ informe le parent aussi
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // Générer le slug automatiquement
    const formData = {
      ...form.value,
      slug: generateSlug(form.value.title)
    }

    emit('submit', formData)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <VCard elevation="2" class="pa-4">
    <VCardText>
      <VForm @submit.prevent="handleSubmit" class="category-form">
        <!-- Titre -->
        <VRow dense>
          <VCol cols="12">
            <VTextField v-model="form.title" label="Titre de la catégorie *" :rules="titleRules" required clearable
              variant="outlined" prepend-inner-icon="ri-bookmark-line"
              placeholder="Ex: Actualités, Tutoriels, Guides..." autofocus />
          </VCol>
        </VRow>

        <!-- Description -->
        <VRow dense>
          <VCol cols="12">
            <VTextarea v-model="form.description" label="Description" :rules="descriptionRules" clearable
              variant="outlined" rows="4" prepend-inner-icon="ri-align-left"
              placeholder="Décrivez brièvement cette catégorie..." />
          </VCol>
        </VRow>

        <!-- Aperçu du slug (si le titre existe) -->
        <VRow v-if="form.title" dense>
          <VCol cols="12">
            <VAlert type="info" variant="tonal" class="mb-4">
              <template #prepend>
                <VIcon icon="ri-information-line" />
              </template>
              <div>
                <strong>Slug généré :</strong> {{ generateSlug(form.title) }}
                <div class="text-caption mt-1">
                  L'URL de cette catégorie sera : <code>/blog/category/{{ generateSlug(form.title) }}</code>
                </div>
              </div>
            </VAlert>
          </VCol>
        </VRow>
      </VForm>
    </VCardText>

    <VDivider />

    <!-- Actions -->
    <VCardActions class="pa-3">
      <VSpacer />
      <VBtn color="error" variant="flat" @click="clearForm" >
        Annuler
      </VBtn>
      <VBtn color="primary" variant="flat" type="submit" @click="handleSubmit"
        :loading="isSubmitting">
        {{ submitLabel }}
      </VBtn>
    </VCardActions>
  </VCard>
</template>


<style scoped>
.category-form {
  max-width: 100%;
}

.v-card-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
}

.v-card-title .v-icon {
  color: white;
}

.v-text-field,
.v-textarea {
  margin-bottom: 16px;
}

.v-alert {
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}



/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-form-card {
  animation: slideInUp 0.5s ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .v-card-title {
    padding: 16px;
  }

  .v-card-actions {
    flex-direction: column;
    gap: 12px;
  }

  .v-card-actions .v-btn {
    width: 100%;
  }
}
</style>

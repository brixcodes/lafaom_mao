<script setup lang="ts">
import { computed } from 'vue'
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

// Proxy réactif : permet d’écrire directement v-model="form.title"
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
]

const descriptionRules = [
  (v: string) => {
    if (!v) return true
    const res = validateMinLength(v, 3, 'Description')
    return res.valid ? true : 'La description doit contenir au moins 3 caractères.'
  },
]

const clearForm = () => {
  form.value = { title: '', slug: '', description: '' }
  emit('cancel') // ✅ informe le parent aussi
}

const handleSubmit = () => {
  emit('submit', { ...form.value })
}
</script>

<template>
  <VForm @submit.prevent="handleSubmit">
    <VTextField
      v-model="form.title"
      label="Titre de la catégorie"
      :rules="titleRules"
      required
      clearable
      class="mb-4"
      variant="outlined"
      prepend-inner-icon="ri-bookmark-line"
    />

    <VTextarea
      v-model="form.description"
      label="Description"
      :rules="descriptionRules"
      clearable
      class="mb-4"
      variant="outlined"
      rows="3"
      prepend-inner-icon="ri-align-left"
    />

    <VDivider class="my-4" />
    <VCardActions class="justify-end">
      <VBtn color="error" variant="flat" size="large" @click="clearForm">
        Annuler
      </VBtn>
      <VBtn color="primary" variant="flat" size="large" type="submit">
        {{ submitLabel }}
      </VBtn>
    </VCardActions>
  </VForm>
</template>

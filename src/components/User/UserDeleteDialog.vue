
<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

defineProps<{ modelValue: boolean }>()
defineEmits(['update:modelValue', 'delete'])
</script>

<template>
  <VDialog
    :model-value="modelValue"
    max-width="400"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <VCard>
      <VCardTitle>
        Confirmer la suppression
      </VCardTitle>
      <VCardText>
        Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Annuler
        </VBtn>
        <VBtn
          color="error"
          @click="$emit('delete')"
        >
          Supprimer
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

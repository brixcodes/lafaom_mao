<template>
  <VContainer>
    <VCard elevation="2" class="pa-4">
      <VCardText>
        <VForm @submit.prevent="handleSubmit" ref="formRef">
          <VRow class="mb-2">
            <VCol cols="12" md="6">
              <VTextField v-model="localForm.first_name" label="Prénom" :rules="firstNameRules" required
                prepend-inner-icon="ri-user-line" clearable />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localForm.last_name" label="Nom" :rules="lastNameRules" required
                prepend-inner-icon="ri-user-line" clearable />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localForm.email" label="Email" type="email" :rules="emailRules" required
                prepend-inner-icon="ri-mail-line" clearable />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="localForm.mobile_number" label="Téléphone" :rules="phoneRules"
                prepend-inner-icon="ri-phone-line" clearable />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="localForm.user_type" :items="userTypeOptions" label="Type d'utilisateur"
                :rules="userTypeRules" required prepend-inner-icon="ri-user-settings-line" clearable />
            </VCol>
            <VCol cols="12" md="6">
              <VSelect v-model="localForm.status" :items="statusOptions" label="Statut" :rules="statusRules" required
                prepend-inner-icon="ri-checkbox-circle-line" clearable />
            </VCol>
          </VRow>
          <VDivider class="my-4" />
          <VCardActions class="justify-end">
            <VBtn color="error" variant="flat" size="large" @click="clearForm" >
              Annuler
            </VBtn>

            <VBtn color="primary" variant="flat" size="large" type="submit" >
              {{submitLabel}}
            </VBtn>
          </VCardActions>
        </VForm>
      </VCardText>
    </VCard>
  </VContainer>
</template>


<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  validateRequired,
  validateEmail,
  validateMinLength,
  validateMaxLength,
  validateEnum,
} from '@/utils/validation'

const props = defineProps({
  form: Object,
  userTypeOptions: Array,
  statusOptions: Array,
  submitLabel: {
    type: String,
    default: 'Valider'
  }
})
const emit = defineEmits(['submit'])
const router = useRouter()
const localForm = ref({ ...props.form })
const formRef = ref()

watch(() => props.form, (newVal) => {
  localForm.value = { ...newVal }
})



// Validation rules using generic validators
const firstNameRules = [
  (v: string) => validateRequired(v, 'Prénom').valid || validateRequired(v, 'Prénom').error,
  (v: string) => validateMinLength(v, 5, 'Prénom').valid || validateMinLength(v, 5, 'Prénom').error,
  (v: string) => validateMaxLength(v, 50, 'Prénom').valid || validateMaxLength(v, 50, 'Prénom').error,
]
const lastNameRules = [
  (v: string) => validateRequired(v, 'Nom').valid || validateRequired(v, 'Nom').error,
  (v: string) => validateMinLength(v, 5, 'Nom').valid || validateMinLength(v, 5, 'Nom').error,
  (v: string) => validateMaxLength(v, 50, 'Nom').valid || validateMaxLength(v, 50, 'Nom').error,
]
const emailRules = [
  (v: string) => validateEmail(v, 'Email').valid || validateEmail(v, 'Email').error,
  (v: string) => validateMaxLength(v, 100, 'Email').valid || validateMaxLength(v, 100, 'Email').error,
]
const phoneRules = [
  (v: string) => !v || (/^\d{8,15}$/.test(v) ? true : 'Numéro invalide'),
]
const userTypeRules = [
  (v: string) => validateRequired(v, 'Type d\'utilisateur').valid || validateRequired(v, 'Type d\'utilisateur').error,
  (v: string) => validateEnum(v, ((props.userTypeOptions ?? []) as Array<{ value: string }>).map(o => o.value), 'Type d\'utilisateur').valid || validateEnum(v, ((props.userTypeOptions ?? []) as Array<{ value: string }>).map(o => o.value), 'Type d\'utilisateur').error,
]
const statusRules = [
  (v: string) => validateRequired(v, 'Statut').valid || validateRequired(v, 'Statut').error,
  (v: string) => validateEnum(v, ((props.statusOptions ?? []) as Array<{ value: string }>).map(o => o.value), 'Statut').valid || validateEnum(v, ((props.statusOptions ?? []) as Array<{ value: string }>).map(o => o.value), 'Statut').error,
]

const handleSubmit = () => {
  emit('submit', localForm.value)
}

const clearForm = () => {
  localForm.value = { ...props.form }
  if (formRef.value?.resetValidation) formRef.value.resetValidation()
}

</script>

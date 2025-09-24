<template>
  <VForm @submit.prevent="handleSubmit">
    <VCard>
      <VCardTitle>
        <div class="d-flex align-center justify-space-between">
          <span>{{ title }}</span>
          <div class="d-flex gap-2">
            <!-- Bouton d'annulation -->
            <VBtn variant="outlined" @click="$emit('cancel')">
              Annuler
            </VBtn>
            
            <!-- Bouton de sauvegarde avec permission -->
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_CREATE_USER, PermissionEnum.CAN_UPDATE_USER]"
              :require-all="false"
              :show-fallback="false"
            >
              <VBtn 
                type="submit" 
                color="primary"
                :loading="loading"
                :disabled="!isFormValid"
              >
                {{ submitLabel }}
              </VBtn>
            </PermissionGuard>
          </div>
        </div>
      </VCardTitle>

      <VCardText>
        <VRow>
          <!-- Informations de base -->
          <VCol cols="12" md="6">
            <VTextField
              v-model="form.first_name"
              label="Prénom"
              :rules="[rules.required]"
              :disabled="!canEditBasicInfo"
              required
            />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField
              v-model="form.last_name"
              label="Nom"
              :rules="[rules.required]"
              :disabled="!canEditBasicInfo"
              required
            />
          </VCol>

          <!-- Email avec restriction -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_VIEW_USER]"
              :show-fallback="true"
            >
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[rules.required, rules.email]"
                :disabled="!canEditBasicInfo"
                required
              />
              <template #fallback>
                <VTextField
                  label="Email"
                  value="***@***.***"
                  disabled
                  readonly
                />
              </template>
            </PermissionGuard>
          </VCol>

          <!-- Téléphone avec restriction -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_VIEW_USER]"
              :show-fallback="true"
            >
              <VTextField
                v-model="form.mobile_number"
                label="Téléphone"
                :disabled="!canEditBasicInfo"
              />
              <template #fallback>
                <VTextField
                  label="Téléphone"
                  value="*** *** ***"
                  disabled
                  readonly
                />
              </template>
            </PermissionGuard>
          </VCol>

          <!-- Mot de passe avec restriction -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="false"
            >
              <VTextField
                v-model="form.password"
                label="Mot de passe"
                type="password"
                :rules="[rules.required]"
                :disabled="!canEditBasicInfo"
                required
              />
            </PermissionGuard>
          </VCol>

          <!-- Type d'utilisateur avec restriction -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="true"
            >
              <VSelect
                v-model="form.user_type"
                :items="userTypeOptions"
                label="Type d'utilisateur"
                :disabled="!canEditBasicInfo"
                required
              />
              <template #fallback>
                <VTextField
                  :model-value="getUserTypeLabel(form.user_type)"
                  label="Type d'utilisateur"
                  disabled
                  readonly
                />
              </template>
            </PermissionGuard>
          </VCol>

          <!-- Statut avec restriction -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="true"
            >
              <VSelect
                v-model="form.status"
                :items="statusOptions"
                label="Statut"
                :disabled="!canEditBasicInfo"
                required
              />
              <template #fallback>
                <VTextField
                  :model-value="getStatusLabel(form.status)"
                  label="Statut"
                  disabled
                  readonly
                />
              </template>
            </PermissionGuard>
          </VCol>

          <!-- Informations sensibles avec restrictions strictes -->
          <VCol cols="12" md="6">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_UPDATE_USER]"
              :show-fallback="false"
            >
              <VSwitch
                v-model="form.two_factor_enabled"
                label="Authentification à deux facteurs"
                :disabled="!canEditBasicInfo"
              />
            </PermissionGuard>
          </VCol>
        </VRow>

        <!-- Section permissions (si autorisé) -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_PERMISSION]"
          :show-fallback="false"
        >
          <VDivider class="my-4" />
          <h3 class="text-h6 mb-3">Gestion des permissions</h3>
          <UserPermissionManager :user-id="form.id || ''" />
        </PermissionGuard>

        <!-- Section rôles (si autorisé) -->
        <PermissionGuard 
          :permissions="[PermissionEnum.CAN_GIVE_ROLE]"
          :show-fallback="false"
        >
          <VDivider class="my-4" />
          <h3 class="text-h6 mb-3">Gestion des rôles</h3>
          <UserRoleManager :user-id="form.id || ''" />
        </PermissionGuard>
      </VCardText>
    </VCard>
  </VForm>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'
import UserPermissionManager from './UserPermissionManager.vue'
import UserRoleManager from './UserRoleManager.vue'

interface UserForm {
  id?: string
  first_name: string
  last_name: string
  email: string
  mobile_number?: string
  password: string
  user_type: string
  status: string
  two_factor_enabled: boolean
}

interface Props {
  form: UserForm
  title: string
  submitLabel: string
  loading?: boolean
  userTypeOptions: Array<{ value: string; title: string }>
  statusOptions: Array<{ value: string; title: string }>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [form: UserForm]
  cancel: []
}>()

const { canCreateUsers, canUpdateUsers, canViewUsers } = usePermissions()

// Règles de validation
const rules = {
  required: (value: string) => !!value || 'Ce champ est requis',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email invalide'
  }
}

// Vérifier si l'utilisateur peut modifier les informations de base
const canEditBasicInfo = computed(() => {
  return canCreateUsers.value || canUpdateUsers.value
})

// Vérifier si le formulaire est valide
const isFormValid = computed(() => {
  return props.form.first_name && 
         props.form.last_name && 
         props.form.email && 
         props.form.user_type && 
         props.form.status
})

// Gestionnaires
const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', props.form)
  }
}

const getUserTypeLabel = (value: string) => {
  const option = props.userTypeOptions.find(opt => opt.value === value)
  return option?.title || value
}

const getStatusLabel = (value: string) => {
  const option = props.statusOptions.find(opt => opt.value === value)
  return option?.title || value
}
</script>

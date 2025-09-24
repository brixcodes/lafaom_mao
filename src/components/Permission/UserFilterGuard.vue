<template>
  <VCard class="mb-4">
    <VCardText>
      <VRow>
        <!-- Recherche -->
        <VCol cols="12" md="4">
          <VTextField
            v-model="searchQuery"
            label="Rechercher un utilisateur"
            prepend-inner-icon="ri-search-line"
            clearable
            @input="$emit('search', searchQuery)"
            @clear="$emit('search', '')"
          />
        </VCol>

        <!-- Filtre par type d'utilisateur -->
        <VCol cols="12" md="2">
          <PermissionGuard 
            :permissions="[PermissionEnum.CAN_VIEW_USER]"
            :show-fallback="true"
          >
            <VSelect
              v-model="selectedUserType"
              :items="userTypeOptions"
              label="Type d'utilisateur"
              clearable
              @update:model-value="$emit('filter-type', selectedUserType)"
            />
            <template #fallback>
              <VSelect
                :items="[]"
                label="Type d'utilisateur"
                disabled
                readonly
              />
            </template>
          </PermissionGuard>
        </VCol>

        <!-- Filtre par statut -->
        <VCol cols="12" md="2">
          <PermissionGuard 
            :permissions="[PermissionEnum.CAN_VIEW_USER]"
            :show-fallback="true"
          >
            <VSelect
              v-model="selectedStatus"
              :items="statusOptions"
              label="Statut"
              clearable
              @update:model-value="$emit('filter-status', selectedStatus)"
            />
            <template #fallback>
              <VSelect
                :items="[]"
                label="Statut"
                disabled
                readonly
              />
            </template>
          </PermissionGuard>
        </VCol>

        <!-- Filtre par date de création -->
        <VCol cols="12" md="2">
          <PermissionGuard 
            :permissions="[PermissionEnum.CAN_VIEW_USER]"
            :show-fallback="true"
          >
            <VSelect
              v-model="selectedDateRange"
              :items="dateRangeOptions"
              label="Période"
              clearable
              @update:model-value="$emit('filter-date', selectedDateRange)"
            />
            <template #fallback>
              <VSelect
                :items="[]"
                label="Période"
                disabled
                readonly
            />
            </template>
          </PermissionGuard>
        </VCol>

        <!-- Actions de filtrage -->
        <VCol cols="12" md="2">
          <div class="d-flex gap-2">
            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_VIEW_USER]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                prepend-icon="ri-filter-line"
                @click="$emit('apply-filters')"
              >
                Filtrer
              </VBtn>
            </PermissionGuard>

            <PermissionGuard 
              :permissions="[PermissionEnum.CAN_VIEW_USER]"
              :show-fallback="false"
            >
              <VBtn
                variant="outlined"
                prepend-icon="ri-refresh-line"
                @click="$emit('clear-filters')"
              >
                Effacer
              </VBtn>
            </PermissionGuard>
          </div>
        </VCol>
      </VRow>

      <!-- Filtres avancés (si autorisé) -->
      <PermissionGuard 
        :permissions="[PermissionEnum.CAN_VIEW_USER]"
        :show-fallback="false"
      >
        <VExpansionPanels v-model="showAdvancedFilters" class="mt-4">
          <VExpansionPanel>
            <VExpansionPanelTitle>
              <VIcon icon="ri-settings-3-line" class="mr-2" />
              Filtres avancés
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VRow>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="advancedFilters.email"
                    label="Email spécifique"
                    type="email"
                    @input="$emit('filter-email', advancedFilters.email)"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VTextField
                    v-model="advancedFilters.phone"
                    label="Téléphone"
                    @input="$emit('filter-phone', advancedFilters.phone)"
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VSelect
                    v-model="advancedFilters.twoFactor"
                    :items="twoFactorOptions"
                    label="Authentification 2FA"
                    clearable
                    @update:model-value="$emit('filter-2fa', advancedFilters.twoFactor)"
                  />
                </VCol>
              </VRow>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </PermissionGuard>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'
import PermissionGuard from './PermissionGuard.vue'

interface Props {
  userTypeOptions: Array<{ value: string; title: string }>
  statusOptions: Array<{ value: string; title: string }>
}

defineProps<Props>()

defineEmits<{
  search: [query: string]
  'filter-type': [type: string]
  'filter-status': [status: string]
  'filter-date': [dateRange: string]
  'filter-email': [email: string]
  'filter-phone': [phone: string]
  'filter-2fa': [twoFactor: boolean]
  'apply-filters': []
  'clear-filters': []
}>()

const { canViewUsers } = usePermissions()

// États réactifs
const searchQuery = ref('')
const selectedUserType = ref('')
const selectedStatus = ref('')
const selectedDateRange = ref('')
const showAdvancedFilters = ref(false)

const advancedFilters = reactive({
  email: '',
  phone: '',
  twoFactor: null as boolean | null
})

// Options pour les filtres
const dateRangeOptions = [
  { title: 'Dernière semaine', value: 'week' },
  { title: 'Dernier mois', value: 'month' },
  { title: 'Derniers 3 mois', value: 'quarter' },
  { title: 'Dernière année', value: 'year' }
]

const twoFactorOptions = [
  { title: 'Activé', value: true },
  { title: 'Désactivé', value: false }
]
</script>

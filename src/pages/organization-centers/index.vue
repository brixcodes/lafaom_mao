<template>
  <div class="organization-centers-page">
    <!-- En-tête -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          <VIcon icon="ri-building-line" class="me-3" color="primary" />
          Centres d'Organisation
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez et consultez tous les centres d'organisation disponibles
        </p>
      </div>
      <VBtn prepend-icon="ri-add-line" color="primary" :to="{ name: 'organization-centers-create' }" v-if="hasPermissions([PermissionEnum.CAN_CREATE_ORGANIZATION_CENTER])">
        Créer un centre
      </VBtn>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol cols="12" md="3">
            <VTextField v-model="searchQuery" prepend-inner-icon="ri-search-line" label="Rechercher un centre..."
              variant="outlined" density="compact" clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="filterStatus" :items="statusOptions" label="Statut" variant="outlined" density="compact"
              clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="filterType" :items="typeOptions" label="Type" variant="outlined" density="compact"
              clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="filterCountry" :items="countryOptions" label="Pays" variant="outlined" density="compact"
              clearable />
          </VCol>
          <VCol cols="12" md="2">
            <VSelect v-model="sortBy" :items="sortOptions" label="Trier par" variant="outlined" density="compact" />
          </VCol>
          <VCol cols="12" md="1" class="d-flex align-center">
            <VBtn variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters" :disabled="!hasActiveFilters">
              Reset
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Indicateur de filtres actifs -->
    <div v-if="hasActiveFilters" class="mb-4">
      <VAlert type="info" variant="tonal" class="d-flex align-center">
        <div class="d-flex align-center flex-grow-1">
          <VIcon icon="ri-filter-line" class="me-2" />
          <span>{{ filteredCenters.length }} sur {{ allCenters.length }} centre(s) correspond(ent) aux
            filtres</span>
        </div>
        <VBtn variant="text" size="small" prepend-icon="ri-close-line" @click="resetFilters">
          Effacer
        </VBtn>
      </VAlert>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement des centres...</p>
    </div>

    <!-- Liste des centres -->
    <div v-else-if="hasCenters && hasPermissions([PermissionEnum.CAN_VIEW_ORGANIZATION_CENTER])">
      <VRow>
        <VCol v-for="center in centers" :key="center.id" cols="12" sm="6" md="6" lg="4">
          <VCard class="mx-auto my-6">
            <!-- Header -->
            <VCardItem>
              <VCardTitle class="text-h6 line-clamp-2">{{ truncateText(center.name, 45) }}</VCardTitle>
              <VCardSubtitle class="d-flex align-center gap-1">
                <VIcon size="small">ri-building-2-line</VIcon>
                <span class="text-body-2">Type: {{ center.organization_type }}</span>
              </VCardSubtitle>
            </VCardItem>

            <!-- Rating -->
            <VCardText>
              <!-- Details -->
              <VRow class="text-body-2 ma-0 pa-0" no-gutters>
                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" size="small" class="me-2" />
                  <span>Ville :{{ center.city }}</span>
                </VCol>
                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-map-pin-line" size="small" class="me-2" />
                  <span>BP :{{ center.address }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-cellphone-line" size="small" class="me-2" />
                  <span>{{ center.telephone_number }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-phone-line" size="small" class="me-2" />
                  <span>{{ center.mobile_number }}</span>
                </VCol>

                <VCol cols="12" md="12" class="d-flex align-center mb-2">
                  <VIcon icon="ri-mail-line" size="small" class="me-2" />
                  <span>{{ center.email }}</span>
                </VCol>

                <VCol cols="12" md="4" class="d-flex align-center mb-2">
                  <VIcon icon="ri-global-line" size="small" class="me-2" />
                  <span>{{ center.website || 'Aucun site web' }}</span>
                </VCol>
              </VRow>

              <v-divider class="my-2"></v-divider>

              <!-- Actions -->
              <VCardActions>
                <VSpacer />

                <VMenu offset-y>
                  <template #activator="{ props }">
                    <VBtn icon="ri-more-2-line" variant="flat" size="x-small" v-bind="props" />
                  </template>
                  <VList>
                    <VListItem prepend-icon="ri-eye-line" title="Voir les détails"
                      :to="{ name: 'organization-centers-detail', params: { id: center.id } }"  v-if="hasPermissions([PermissionEnum.CAN_VIEW_ORGANIZATION_CENTER])" />
                      
                    <VListItem  prepend-icon="ri-edit-line" title="Modifier"
                      :to="{ name: 'organization-centers-edit', params: { id: center.id } }"  v-if="hasPermissions([PermissionEnum.CAN_UPDATE_ORGANIZATION_CENTER])" />

                    <VListItem  prepend-icon="ri-toggle-line" title="Changer le statut"
                      @click="toggleStatus(center)" v-if="hasPermissions([PermissionEnum.CAN_UPDATE_ORGANIZATION_CENTER])"/>

                    <span v-if="hasPermissions([PermissionEnum.CAN_DELETE_ORGANIZATION_CENTER])">
                      <VDivider />
                      <VListItem  prepend-icon="ri-delete-bin-line" title="Supprimer"
                        class="text-error" @click="confirmDelete(center)" />
                    </span>
                  </VList>
                </VMenu>
              </VCardActions>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Pagination -->
      <div class="d-flex justify-center mt-6">
        <VPagination v-model="currentPage" :length="totalPages" :total-visible="7" @update:model-value="changePage" />
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="text-center pa-12">
      <VIcon icon="ri-building-line" size="120" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h5 mb-4">
        {{ hasActiveFilters ? 'Aucun résultat' : "Aucun centre d'organisation" }}
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        {{
          hasActiveFilters
            ? 'Aucun centre ne correspond à vos critères de recherche.'
            : "Commencez par créer votre premier centre d'organisation."
        }}
      </p>
      <div class="d-flex justify-center gap-3">
        <VBtn v-if="hasActiveFilters" variant="outlined" prepend-icon="ri-refresh-line" @click="resetFilters">
          Réinitialiser les filtres
        </VBtn>
        <VBtn v-if="!hasActiveFilters" prepend-icon="ri-add-line" color="primary" size="large"
          :to="{ name: 'organization-centers-create' }">
          Créer mon premier centre
        </VBtn>
      </div>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { organizationCentersService } from '@/services/api/organization-centers'
import type { OrganizationCenter, OrganizationCenterFilter } from '@/types/organizationCenters'
import { OrganizationStatusEnum, OrganizationTypeEnum } from '@/types/organizationCenters'
import { usePermissions } from '@/composables/usePermissions'
import { TrainingPermission } from '@/types/permissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

import { PermissionEnum } from '@/types/permissions'
import { useInstantPermissions } from '@/composables/useInstantPermissions'
const { hasPermission, hasPermissions } = useInstantPermissions()

const router = useRouter()

// Expansion par centre
const expandedCenters = ref<Set<number>>(new Set())
const toggleCenterDetails = (id: number) => {
  if (expandedCenters.value.has(id)) {
    expandedCenters.value.delete(id)
  } else {
    expandedCenters.value.add(id)
  }
}

// Utils
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// State
const allCenters = ref<OrganizationCenter[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const filterType = ref('')
const filterCountry = ref('')
const sortBy = ref('created_at')
const currentPage = ref(1)
const pageSize = ref(12)
const isInitialLoading = ref(true)
const isDeleting = ref(false)
const error = ref('')

// Computed pour filtrage côté client
const filteredCenters = computed(() => {
  if (!allCenters.value || !Array.isArray(allCenters.value)) return []

  let filtered = [...allCenters.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      center =>
        (center.name || '').toLowerCase().includes(query) ||
        (center.email || '').toLowerCase().includes(query) ||
        (center.city || '').toLowerCase().includes(query) ||
        (center.address || '').toLowerCase().includes(query) ||
        (center.telephone_number || '').toLowerCase().includes(query) ||
        (center.description || '').toLowerCase().includes(query)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(center => center.status === filterStatus.value)
  }

  if (filterType.value) {
    filtered = filtered.filter(center => center.organization_type === filterType.value)
  }

  if (filterCountry.value) {
    filtered = filtered.filter(center => center.country_code === filterCountry.value)
  }

  filtered.sort((a, b) => {
    let aVal, bVal
    switch (sortBy.value) {
      case 'name':
        aVal = (a.name || '').toLowerCase()
        bVal = (b.name || '').toLowerCase()
        return aVal.localeCompare(bVal)
      case 'city':
        aVal = (a.city || '').toLowerCase()
        bVal = (b.city || '').toLowerCase()
        return aVal.localeCompare(bVal)
      case 'created_at':
      default:
        aVal = a.created_at ? new Date(a.created_at).getTime() : 0
        bVal = b.created_at ? new Date(b.created_at).getTime() : 0
        return bVal - aVal
    }
  })

  return filtered
})

// Pagination
const paginatedCenters = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCenters.value.slice(start, end)
})

const centers = computed(() => paginatedCenters.value)
const hasCenters = computed(() => filteredCenters.value.length > 0)
const isLoading = computed(() => isInitialLoading.value)

const totalPages = computed(() => Math.ceil(filteredCenters.value.length / pageSize.value))

// Filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || filterStatus.value !== '' || filterType.value !== '' || filterCountry.value !== '' || sortBy.value !== 'created_at'
})

// Permissions
const hasUpdatePermission = computed(() => hasPermission(TrainingPermission.EDIT_TRAINING))
const hasDeletePermission = computed(() => hasPermission(TrainingPermission.DELETE_TRAINING))

// Options filtres
const statusOptions = [
  { title: 'Tous les statuts', value: '' },
  { title: 'Actif', value: OrganizationStatusEnum.ACTIVE },
  { title: 'Inactif', value: OrganizationStatusEnum.INACTIVE },
  { title: 'Suspendu', value: OrganizationStatusEnum.SUSPENDED },
  { title: 'Supprimé', value: OrganizationStatusEnum.DELETED },
]

const typeOptions = [
  { title: 'Tous les types', value: '' },
  { title: 'Principal', value: OrganizationTypeEnum.MAIN },
  { title: 'Succursale', value: OrganizationTypeEnum.BRANCH },
  { title: 'Partenaire', value: OrganizationTypeEnum.PARTNER },
  { title: 'Affilié', value: OrganizationTypeEnum.AFFILIATE },
]

const countryOptions = [
  { title: 'Afghanistan', value: 'AF' },
  { title: 'Afrique du Sud', value: 'ZA' },
  { title: 'Albanie', value: 'AL' },
  { title: 'Algérie', value: 'DZ' },
  { title: 'Allemagne', value: 'DE' },
  { title: 'Andorre', value: 'AD' },
  { title: 'Angola', value: 'AO' },
  { title: 'Antigua-et-Barbuda', value: 'AG' },
  { title: 'Arabie Saoudite', value: 'SA' },
  { title: 'Argentine', value: 'AR' },
  { title: 'Arménie', value: 'AM' },
  { title: 'Australie', value: 'AU' },
  { title: 'Autriche', value: 'AT' },
  { title: 'Azerbaïdjan', value: 'AZ' },
  { title: 'Bahamas', value: 'BS' },
  { title: 'Bahreïn', value: 'BH' },
  { title: 'Bangladesh', value: 'BD' },
  { title: 'Barbade', value: 'BB' },
  { title: 'Belgique', value: 'BE' },
  { title: 'Belize', value: 'BZ' },
  { title: 'Bénin', value: 'BJ' },
  { title: 'Bhoutan', value: 'BT' },
  { title: 'Biélorussie', value: 'BY' },
  { title: 'Birmanie', value: 'MM' },
  { title: 'Bolivie', value: 'BO' },
  { title: 'Bosnie-Herzégovine', value: 'BA' },
  { title: 'Botswana', value: 'BW' },
  { title: 'Brésil', value: 'BR' },
  { title: 'Brunei', value: 'BN' },
  { title: 'Bulgarie', value: 'BG' },
  { title: 'Burkina Faso', value: 'BF' },
  { title: 'Burundi', value: 'BI' },
  { title: 'Cambodge', value: 'KH' },
  { title: 'Cameroun', value: 'CM' },
  { title: 'Canada', value: 'CA' },
  { title: 'Cap-Vert', value: 'CV' },
  { title: 'Chili', value: 'CL' },
  { title: 'Chine', value: 'CN' },
  { title: 'Chypre', value: 'CY' },
  { title: 'Colombie', value: 'CO' },
  { title: 'Comores', value: 'KM' },
  { title: 'Congo-Brazzaville', value: 'CG' },
  { title: 'Congo-Kinshasa', value: 'CD' },
  { title: 'Corée du Nord', value: 'KP' },
  { title: 'Corée du Sud', value: 'KR' },
  { title: 'Costa Rica', value: 'CR' },
  { title: 'Croatie', value: 'HR' },
  { title: 'Cuba', value: 'CU' },
  { title: 'Danemark', value: 'DK' },
  { title: 'Djibouti', value: 'DJ' },
  { title: 'Dominique', value: 'DM' },
  { title: 'Égypte', value: 'EG' },
  { title: 'Émirats arabes unis', value: 'AE' },
  { title: 'Équateur', value: 'EC' },
  { title: 'Érythrée', value: 'ER' },
  { title: 'Espagne', value: 'ES' },
  { title: 'Estonie', value: 'EE' },
  { title: 'États-Unis', value: 'US' },
  { title: 'Éthiopie', value: 'ET' },
  { title: 'Fidji', value: 'FJ' },
  { title: 'Finlande', value: 'FI' },
  { title: 'France', value: 'FR' },
  { title: 'Gabon', value: 'GA' },
  { title: 'Gambie', value: 'GM' },
  { title: 'Géorgie', value: 'GE' },
  { title: 'Ghana', value: 'GH' },
  { title: 'Grèce', value: 'GR' },
  { title: 'Grenade', value: 'GD' },
  { title: 'Guatemala', value: 'GT' },
  { title: 'Guinée', value: 'GN' },
  { title: 'Guinée-Bissau', value: 'GW' },
  { title: 'Guinée équatoriale', value: 'GQ' },
  { title: 'Guyana', value: 'GY' },
  { title: 'Haïti', value: 'HT' },
  { title: 'Honduras', value: 'HN' },
  { title: 'Hongrie', value: 'HU' },
  { title: 'Îles Marshall', value: 'MH' },
  { title: 'Inde', value: 'IN' },
  { title: 'Indonésie', value: 'ID' },
  { title: 'Irak', value: 'IQ' },
  { title: 'Iran', value: 'IR' },
  { title: 'Irlande', value: 'IE' },
  { title: 'Islande', value: 'IS' },
  { title: 'Israël', value: 'IL' },
  { title: 'Italie', value: 'IT' },
  { title: 'Jamaïque', value: 'JM' },
  { title: 'Japon', value: 'JP' },
  { title: 'Jordanie', value: 'JO' },
  { title: 'Kazakhstan', value: 'KZ' },
  { title: 'Kenya', value: 'KE' },
  { title: 'Kirghizistan', value: 'KG' },
  { title: 'Kiribati', value: 'KI' },
  { title: 'Kosovo', value: 'XK' },
  { title: 'Koweït', value: 'KW' },
  { title: 'Laos', value: 'LA' },
  { title: 'Lettonie', value: 'LV' },
  { title: 'Liban', value: 'LB' },
  { title: 'Liberia', value: 'LR' },
  { title: 'Libye', value: 'LY' },
  { title: 'Liechtenstein', value: 'LI' },
  { title: 'Lituanie', value: 'LT' },
  { title: 'Luxembourg', value: 'LU' },
  { title: 'Macédoine du Nord', value: 'MK' },
  { title: 'Madagascar', value: 'MG' },
  { title: 'Malaisie', value: 'MY' },
  { title: 'Malawi', value: 'MW' },
  { title: 'Maldives', value: 'MV' },
  { title: 'Mali', value: 'ML' },
  { title: 'Malte', value: 'MT' },
  { title: 'Maroc', value: 'MA' },
  { title: 'Maurice', value: 'MU' },
  { title: 'Mauritanie', value: 'MR' },
  { title: 'Mexique', value: 'MX' },
  { title: 'Micronésie', value: 'FM' },
  { title: 'Moldavie', value: 'MD' },
  { title: 'Monaco', value: 'MC' },
  { title: 'Mongolie', value: 'MN' },
  { title: 'Monténégro', value: 'ME' },
  { title: 'Mozambique', value: 'MZ' },
  { title: 'Namibie', value: 'NA' },
  { title: 'Nauru', value: 'NR' },
  { title: 'Népal', value: 'NP' },
  { title: 'Nicaragua', value: 'NI' },
  { title: 'Niger', value: 'NE' },
  { title: 'Nigeria', value: 'NG' },
  { title: 'Norvège', value: 'NO' },
  { title: 'Nouvelle-Zélande', value: 'NZ' },
  { title: 'Oman', value: 'OM' },
  { title: 'Ouganda', value: 'UG' },
  { title: 'Ouzbékistan', value: 'UZ' },
  { title: 'Pakistan', value: 'PK' },
  { title: 'Palaos', value: 'PW' },
  { title: 'Panama', value: 'PA' },
  { title: 'Papouasie-Nouvelle-Guinée', value: 'PG' },
  { title: 'Paraguay', value: 'PY' },
  { title: 'Pays-Bas', value: 'NL' },
  { title: 'Pérou', value: 'PE' },
  { title: 'Philippines', value: 'PH' },
  { title: 'Pologne', value: 'PL' },
  { title: 'Portugal', value: 'PT' },
  { title: 'Qatar', value: 'QA' },
  { title: 'République centrafricaine', value: 'CF' },
  { title: 'République tchèque', value: 'CZ' },
  { title: 'République démocratique du Congo', value: 'CD' },
  { title: 'Roumanie', value: 'RO' },
  { title: 'Royaume-Uni', value: 'GB' },
  { title: 'Russie', value: 'RU' },
  { title: 'Rwanda', value: 'RW' },
  { title: 'Saint-Christophe-et-Niévès', value: 'KN' },
  { title: 'Sainte-Lucie', value: 'LC' },
  { title: 'Saint-Marin', value: 'SM' },
  { title: 'Saint-Vincent-et-les-Grenadines', value: 'VC' },
  { title: 'Salvador', value: 'SV' },
  { title: 'Samoa', value: 'WS' },
  { title: 'São Tomé-et-Príncipe', value: 'ST' },
  { title: 'Sénégal', value: 'SN' },
  { title: 'Serbie', value: 'RS' },
  { title: 'Seychelles', value: 'SC' },
  { title: 'Sierra Leone', value: 'SL' },
  { title: 'Singapour', value: 'SG' },
  { title: 'Slovaquie', value: 'SK' },
  { title: 'Slovénie', value: 'SI' },
  { title: 'Somalie', value: 'SO' },
  { title: 'Soudan', value: 'SD' },
  { title: 'Soudan du Sud', value: 'SS' },
  { title: 'Sri Lanka', value: 'LK' },
  { title: 'Suède', value: 'SE' },
  { title: 'Suisse', value: 'CH' },
  { title: 'Suriname', value: 'SR' },
  { title: 'Tadjikistan', value: 'TJ' },
  { title: 'Tanzanie', value: 'TZ' },
  { title: 'Tchad', value: 'TD' },
  { title: 'Thaïlande', value: 'TH' },
  { title: 'Timor oriental', value: 'TL' },
  { title: 'Togo', value: 'TG' },
  { title: 'Tonga', value: 'TO' },
  { title: 'Trinité-et-Tobago', value: 'TT' },
  { title: 'Tunisie', value: 'TN' },
  { title: 'Turkménistan', value: 'TM' },
  { title: 'Turquie', value: 'TR' },
  { title: 'Tuvalu', value: 'TV' },
  { title: 'Ukraine', value: 'UA' },
  { title: 'Uruguay', value: 'UY' },
  { title: 'Vanuatu', value: 'VU' },
  { title: 'Vatican', value: 'VA' },
  { title: 'Venezuela', value: 'VE' },
  { title: 'Viêt Nam', value: 'VN' },
  { title: 'Zambie', value: 'ZM' },
  { title: 'Zimbabwe', value: 'ZW' },
];

const sortOptions = [
  { title: 'Plus récents', value: 'created_at' },
  { title: 'Nom', value: 'name' },
  { title: 'Ville', value: 'city' },
]

// Methods
const loadAllCenters = async () => {
  try {
    isInitialLoading.value = true
    const response = await organizationCentersService.getOrganizationCenters({ page: 1, page_size: 1000, order_by: 'created_at', asc: 'desc' })
    allCenters.value = [...response.data]
  } catch (err) {
    console.error('Erreur lors du chargement des centres:', err)
    error.value = 'Erreur lors du chargement des centres'
  } finally {
    isInitialLoading.value = false
  }
}

const changePage = (page: number) => {
  currentPage.value = page
}

const confirmDelete = async (center: OrganizationCenter) => {
  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    html: `Souhaitez-vous réellement supprimer le centre <b>${center.name}</b> ?`,
    confirmButtonText: `<span style="color:white">Supprimer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    isDeleting.value = true
    await organizationCentersService.deleteOrganizationCenter(center.id)
    allCenters.value = allCenters.value.filter(c => c.id !== center.id)
    showToast({ message: 'Centre supprimé avec succès', type: 'success' })
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    showToast({ message: 'Erreur lors de la suppression du centre', type: 'error' })
  } finally {
    isDeleting.value = false
  }
}

const toggleStatus = async (center: OrganizationCenter) => {
  const newStatus = center.status === OrganizationStatusEnum.ACTIVE ? OrganizationStatusEnum.INACTIVE : OrganizationStatusEnum.ACTIVE
  const confirmed = await confirmAction({
    title: 'Changer le statut',
    html: `Voulez-vous ${newStatus === OrganizationStatusEnum.ACTIVE ? 'activer' : 'désactiver'} le centre <b>${center.name}</b> ?`,
    confirmButtonText: `<span style="color:white">Confirmer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await organizationCentersService.changeOrganizationCenterStatus(center.id, { status: newStatus })
    center.status = newStatus
    showToast({ message: 'Statut mis à jour avec succès', type: 'success' })
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err)
    showToast({ message: 'Erreur lors de la mise à jour du statut', type: 'error' })
  }
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('fr-FR')

const clearError = () => {
  error.value = ''
}

const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterType.value = ''
  filterCountry.value = ''
  sortBy.value = 'created_at'
  currentPage.value = 1
}

// Helper functions
const getStatusLabel = (status: string) => {
  const labels = {
    [OrganizationStatusEnum.ACTIVE]: 'Actif',
    [OrganizationStatusEnum.INACTIVE]: 'Inactif',
    [OrganizationStatusEnum.SUSPENDED]: 'Suspendu',
    [OrganizationStatusEnum.DELETED]: 'Supprimé'
  }
  return labels[status as OrganizationStatusEnum] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    [OrganizationStatusEnum.ACTIVE]: 'success',
    [OrganizationStatusEnum.INACTIVE]: 'error',
    [OrganizationStatusEnum.SUSPENDED]: 'warning',
    [OrganizationStatusEnum.DELETED]: 'error'
  }
  return colors[status as OrganizationStatusEnum] || 'grey'
}

const getTypeLabel = (type: string) => {
  const labels = {
    [OrganizationTypeEnum.MAIN]: 'Principal',
    [OrganizationTypeEnum.BRANCH]: 'Succursale',
    [OrganizationTypeEnum.PARTNER]: 'Partenaire',
    [OrganizationTypeEnum.AFFILIATE]: 'Affilié'
  }
  return labels[type as OrganizationTypeEnum] || type
}

const getTypeColor = (type: string) => {
  const colors = {
    [OrganizationTypeEnum.MAIN]: 'primary',
    [OrganizationTypeEnum.BRANCH]: 'secondary',
    [OrganizationTypeEnum.PARTNER]: 'success',
    [OrganizationTypeEnum.AFFILIATE]: 'info'
  }
  return colors[type as OrganizationTypeEnum] || 'grey'
}

const getRandomReviews = () => {
  return Math.floor(Math.random() * 50) + 10
}

// Lifecycle
onMounted(() => {
  loadAllCenters()
})

// Watchers
watch([searchQuery, filterStatus, filterType, filterCountry, sortBy], () => {
  currentPage.value = 1
})
</script>

<style scoped>
.organization-centers-page {
  padding: 1.5rem;
}

.gap-3 {
  gap: 12px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .organization-centers-page {
    padding: 1rem;
  }
}
</style>

<template>
  <div class="organization-center-create-page">

    
    <!-- En-tête -->
    <div class="d-flex align-center mb-6">
      <VBtn icon="ri-arrow-left-line" variant="text" @click="handleBack" class="me-3" />
      <div>
        <h1 class="text-h4 mb-1">
          Centre de formation
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Remplissez les informations pour créer un nouveau centre de formation
        </p>
      </div>
    </div>

    <!-- Formulaire -->
    <VCard>
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
        <VCardText>
          <VRow>
            <!-- Nom du centre -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.name" label="Nom du centre" placeholder="Ex: Centre Principal Paris"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-building-line"
                :rules="[(v: string) => !!v || 'Le nom est obligatoire']" required />
            </VCol>

            <!-- Adresse -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.address" label="Adresse" placeholder="Ex: 123 Rue de la Paix"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-map-pin-line"
                :rules="[(v: string) => !!v || 'L\'adresse est obligatoire']" required />
            </VCol>

            <!-- Type d'organisation -->
            <VCol cols="12" md="4">
              <VSelect v-model="center.organization_type" :items="typeOptions" label="Type d'organisation"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-organization-chart"
                :rules="[(v: string) => !!v || 'Le type est obligatoire']" required />
            </VCol>

            <!-- Code postal -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.postal_code" label="Code postal" placeholder="Ex: 75001" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-mail-line" />
            </VCol>

            <!-- Ville -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.city" label="Ville" placeholder="Ex: Paris" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-building-2-line"
                :rules="[(v: string) => !!v || 'La ville est obligatoire']" required />
            </VCol>

            <!-- Code pays -->
            <VCol cols="12" md="4">
              <VSelect v-model="center.country_code" :items="countryOptions" label="Pays" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-flag-line"
                :rules="[(v: string) => !!v || 'Le pays est obligatoire']" required />
            </VCol>

            <!-- Téléphone -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.telephone_number" label="Numéro de téléphone"
                placeholder="Ex: +33 1 23 45 67 89" variant="outlined" density="comfortable"
                prepend-inner-icon="ri-phone-line" :rules="[(v: string) => !!v || 'Le téléphone est obligatoire']"
                required />
            </VCol>

            <!-- Mobile -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.mobile_number" label="Numéro de mobile" placeholder="Ex: +33 6 12 34 56 78"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-smartphone-line" />
            </VCol>

            <!-- Email -->
            <VCol cols="12" md="4">
              <VTextField v-model="center.email" label="Email" type="email" placeholder="Ex: contact@centre.com"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-mail-line" :rules="[
                  (v: string) => !!v || 'L\'email est obligatoire',
                  (v: string) => /.+@.+\..+/.test(v) || 'Email invalide'
                ]" required />
            </VCol>

            <!-- Site web -->
            <VCol cols="12" md="12">
              <VTextField v-model="center.website" label="Site web" placeholder="Ex: https://www.centre.com"
                variant="outlined" density="comfortable" prepend-inner-icon="ri-globe-line" />
            </VCol>

            <!-- Coordonnées GPS -->
            <VCol cols="12">
              <VCard>
                <VCardTitle class="d-flex align-center">
                  <VIcon icon="ri-map-pin-line" class="me-2" color="primary" />
                  <span>Coordonnées GPS</span>
                  <VSpacer />
                  <VBtn
                    v-if="center.latitude && center.longitude"
                    color="success"
                    size="small"
                    prepend-icon="ri-check-line"
                  >
                    Position définie
                  </VBtn>
                </VCardTitle>
                <VDivider />
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model.number="center.latitude"
                        label="Latitude"
                        type="number"
                        step="0.000001"
                        placeholder="Ex: 48.8566"
                        variant="outlined"
                        density="comfortable"
                        readonly
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <VTextField
                        v-model.number="center.longitude"
                        label="Longitude"
                        type="number"
                        step="0.000001"
                        placeholder="Ex: 2.3522"
                        variant="outlined"
                        density="comfortable"
                        readonly
                      />
                    </VCol>
                  </VRow>
                  
                  <VAlert v-if="center.latitude && center.longitude" type="info" variant="tonal" class="mt-4">
                    <template #prepend>
                      <VIcon icon="ri-information-line" />
                    </template>
                    <div>
                      <strong>Position sélectionnée :</strong>
                      <p class="mb-0">{{ center.latitude.toFixed(6) }}, {{ center.longitude.toFixed(6) }}</p>
                    </div>
                  </VAlert>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Sélecteur de carte -->
            <VCol cols="12">
              <VCard>
                <VCardTitle class="d-flex align-center">
                  <VIcon icon="ri-map-line" class="me-2" color="primary" />
                  <span>Sélectionner l'emplacement sur la carte</span>
                </VCardTitle>
                <VDivider />
                <VCardText>
                  <MapLocationPicker
                    :initial-latitude="center.latitude"
                    :initial-longitude="center.longitude"
                    :initial-address="`${center.address}, ${center.city}, ${center.country_code}`"
                    :map-height="400"
                    @location-selected="handleLocationSelected"
                    @location-cleared="handleLocationCleared"
                  />
                </VCardText>
              </VCard>
            </VCol>

            <!-- Statut -->
            <VCol cols="12" md="12">
              <VSelect v-model="center.status" :items="statusOptions" label="Statut" variant="outlined"
                density="comfortable" prepend-inner-icon="ri-checkbox-circle-line"
                :rules="[(v: string) => !!v || 'Le statut est obligatoire']" required />
            </VCol>

            <!-- Description -->
            <VCol cols="12">
              <VTextarea v-model="center.description" label="Description"
                placeholder="Décrivez le centre d'organisation..." variant="outlined" density="comfortable" rows="3"
                prepend-inner-icon="ri-file-text-line" />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="outlined" @click="handleBack" :disabled="isSaving">
            Annuler
          </VBtn>
          <VBtn type="submit" color="primary" :loading="isSaving" :disabled="!isFormValid">
            Enregistrer
          </VBtn>
        </VCardActions>
      </VForm>
    </VCard>

    <!-- Debug -->
    <!-- <DataInspector :data="center" :show="true" /> -->

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { organizationCenterService } from '@/services/api/organizationCenters'
import type { OrganizationCenterCreateInput } from '@/types/organizationCenters'
import { OrganizationStatusEnum, OrganizationTypeEnum } from '@/types/organizationCenters'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import MapLocationPicker from '@/components/common/MapLocationPicker.vue'

const router = useRouter()

// Form ref
const formRef = ref()

// State
const isFormValid = ref(false)
const isSaving = ref(false)
const error = ref('')

// Center form
const center = ref<OrganizationCenterCreateInput>({
  name: '',
  address: '',
  city: '',
  postal_code: undefined,
  country_code: 'FR',
  telephone_number: '',
  mobile_number: '',
  email: '',
  website: undefined,
  latitude: undefined,
  longitude: undefined,
  status: OrganizationStatusEnum.ACTIVE,
  organization_type: OrganizationTypeEnum.MAIN,
  description: undefined
})

// Options
const statusOptions = [
  { title: 'Actif', value: OrganizationStatusEnum.ACTIVE },
  { title: 'Inactif', value: OrganizationStatusEnum.INACTIVE },
  { title: 'Suspendu', value: OrganizationStatusEnum.SUSPENDED },
  { title: 'Supprimé', value: OrganizationStatusEnum.DELETED }
]

const typeOptions = [
  { title: 'Principal', value: OrganizationTypeEnum.MAIN },
  { title: 'Succursale', value: OrganizationTypeEnum.BRANCH },
  { title: 'Partenaire', value: OrganizationTypeEnum.PARTNER },
  { title: 'Affilié', value: OrganizationTypeEnum.AFFILIATE }
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


// Methods
const handleBack = () => {
  router.push('/organization-centers')
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  const confirmed = await confirmAction({
    title: 'Êtes-vous sûr ?',
    text: "Souhaitez-vous réellement créer ce centre de formation ?",
    confirmButtonText: `<span style="color:white">Enregistrer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  isSaving.value = true
  try {
    // Clean data before sending - convert empty strings to undefined for optional fields
    const cleanData = {
      ...center.value,
      postal_code: center.value.postal_code || undefined,
      website: center.value.website || undefined,
      latitude: center.value.latitude || undefined,
      longitude: center.value.longitude || undefined,
      description: center.value.description || undefined,
      mobile_number: center.value.mobile_number || '',
    }
    
    console.log('📤 Sending data to backend:', cleanData)
    
    await organizationCenterService.createOrganizationCenter(cleanData)
    showToast({ message: 'Centre d\'organisation créé avec succès', type: 'success' })
    
    // Vider le formulaire après succès
    clearForm()
    
    // Rediriger vers la liste
    router.push({ name: 'organization-centers-index' })
  } catch (err) {
    console.error('Erreur lors de la création:', err)
    showToast({ message: 'Erreur lors de la création du centre', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const clearError = () => {
  error.value = ''
}

const clearForm = () => {
  center.value = {
    name: '',
    address: '',
    city: '',
    postal_code: undefined,
    country_code: 'FR',
    telephone_number: '',
    mobile_number: '',
    email: '',
    website: undefined,
    latitude: undefined,
    longitude: undefined,
    status: OrganizationStatusEnum.ACTIVE,
    organization_type: OrganizationTypeEnum.MAIN,
    description: undefined
  }
  
  // Reset form validation
  if (formRef.value) {
    formRef.value.reset()
  }
}

// Handle location selection from map
const handleLocationSelected = (location: { latitude: number; longitude: number; address: string }) => {
  center.value.latitude = location.latitude
  center.value.longitude = location.longitude
  showToast({ message: 'Position mise à jour', type: 'success' })
}

// Handle location cleared from map
const handleLocationCleared = () => {
  center.value.latitude = undefined
  center.value.longitude = undefined
  showToast({ message: 'Position effacée', type: 'info' })
}
</script>

<style scoped>
.organization-center-create-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .organization-center-create-page {
    padding: 1rem;
  }
}
</style>

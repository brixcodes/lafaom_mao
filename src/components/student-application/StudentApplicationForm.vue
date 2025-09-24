<template>
  <VForm ref="formRef" @submit.prevent="handleSubmit" :disabled="isSubmitting">
    <VCard>
      <VCardText class="py-4">
        <VRow>

          <VCol cols="12">
            <VAutocomplete v-model="formData.target_session_id" :items="sessionOptions" item-title="title"
              item-value="id" label="Session de formation" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-graduation-cap-line" placeholder="Sélectionnez une session..."
              :loading="isLoadingSessions" :rules="[(v: string) => !!v || 'La session est obligatoire']" required />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="formData.first_name" label="Prénom" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-user-line" :rules="[(v: string) => !!v || 'Le prénom est obligatoire']" required />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="formData.last_name" label="Nom" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-user-line" :rules="[(v: string) => !!v || 'Le nom est obligatoire']" required />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="formData.email" label="Email" type="email" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-mail-line"
              :rules="[(v: string) => !!v || 'L\'email est obligatoire', (v: string) => /.+@.+\..+/.test(v) || 'Email invalide']"
              required />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="formData.phone_number" label="Téléphone" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-phone-line" :rules="[(v: string) => !!v || 'Le téléphone est obligatoire']"
              required />
          </VCol>

          <VCol cols="12" md="6">
            <VSelect v-model="formData.country_code" :items="countryOptions" label="Pays" variant="outlined"
              density="comfortable" prepend-inner-icon="ri-global-line"
              :rules="[(v: string) => !!v || 'Le pays est obligatoire']" required />
          </VCol>

          <VCol cols="12" md="6">
            <VFileInput v-model="formData.attachments" label="Documents à joindre" variant="outlined"
              density="comfortable" prepend-icon="" prepend-inner-icon="ri-attachment-line" multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" :rules="[validateAttachments]" show-size />
            <div class="text-caption text-medium-emphasis mt-1">
              Formats acceptés : PDF, DOC, DOCX, JPG, PNG (max 5MB par fichier)
            </div>
          </VCol>

          <!-- Section paiement obligatoire -->
          <VCol cols="12">
            <VAlert type="warning" variant="tonal" class="mb-4">
              <template #prepend>
                <VIcon icon="ri-money-euro-circle-line" />
              </template>
              <div>
                <strong>Paiement obligatoire</strong>
                <p class="mb-0">Vous devez payer les frais d'étude de dossier avant de pouvoir soumettre votre candidature.</p>
              </div>
            </VAlert>
          </VCol>

          <VCol cols="12">
            <VCard variant="tonal" color="warning" class="mb-4">
              <VCardText>
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <VIcon color="warning" class="mr-2">ri-bank-card-line</VIcon>
                    <span class="text-h6">Frais d'étude de dossier</span>
                  </div>
                  <span class="text-h5 font-weight-bold text-warning">50,00 €</span>
                </div>
                <p class="text-body-2 text-medium-emphasis mb-3">
                  Ces frais sont obligatoires et doivent être payés avant la soumission de votre candidature.
                </p>
                <VBtn
                  color="warning"
                  variant="flat"
                  prepend-icon="ri-bank-card-line"
                  @click="handlePayment"
                  :disabled="!canProceedToPayment || isProcessingPayment"
                  :loading="isProcessingPayment"
                >
                  {{ isPaymentCompleted ? 'Paiement effectué ✓' : 'Payer les frais d\'étude de dossier' }}
                </VBtn>
              </VCardText>
            </VCard>
          </VCol>

          <!-- Message d'erreur -->
          <VCol cols="12" v-if="error">
            <VAlert type="error" variant="tonal" closable @click:close="clearError">
              {{ error }}
            </VAlert>
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />
      <VCardActions class="pa-4">
        <VSpacer />
        <VBtn variant="flat" color="error" @click="$emit('cancel')" :disabled="isSubmitting">
          Annuler
        </VBtn>
        <VBtn type="submit" variant="flat" color="primary" :loading="isSubmitting" :disabled="!isFormValid || !canSubmit">
          Enregistrer
        </VBtn>
      </VCardActions>
    </VCard>
  </VForm>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { StudentApplicationFormData, StudentApplicationCreateInput } from '@/types/student-application'
import { VForm } from 'vuetify/components'

interface Props {
  isSubmitting?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  error: ''
})

const emit = defineEmits<{
  submit: [data: StudentApplicationCreateInput]
  cancel: []
}>()

// Form data
const formData = ref<StudentApplicationFormData>({
  email: '',
  target_session_id: '',
  first_name: '',
  last_name: '',
  phone_number: '',
  country_code: 'SN',
  attachments: []
})

// État du paiement
const isPaymentCompleted = ref(false)
const isProcessingPayment = ref(false)

// Pas de chargement de données initiales - création uniquement

// Form ref
const formRef = ref<VForm | null>(null)

// Loading states
const isLoadingSessions = ref(false)

// Options
const sessionOptions = ref<Array<{ id: string; title: string; training_title: string; start_date: string; end_date: string }>>([])

// Computed properties
const canProceedToPayment = computed(() => {
  return formData.value.first_name && 
         formData.value.last_name && 
         formData.value.email && 
         formData.value.phone_number && 
         formData.value.target_session_id
})

const canSubmit = computed(() => {
  return isPaymentCompleted.value
})

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

// Computed
const isFormValid = computed(() => {
  return !!(
    formData.value.email &&
    formData.value.target_session_id &&
    formData.value.first_name &&
    formData.value.last_name &&
    formData.value.phone_number &&
    formData.value.country_code
  )
})

// Methods
const handleSubmit = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) return

  // Vérifier que le paiement a été effectué
  if (!isPaymentCompleted.value) {
    console.error('Le paiement des frais d\'étude de dossier est obligatoire')
    return
  }

  const submitData: StudentApplicationCreateInput = {
    email: formData.value.email,
    target_session_id: formData.value.target_session_id,
    first_name: formData.value.first_name,
    last_name: formData.value.last_name,
    phone_number: formData.value.phone_number,
    country_code: formData.value.country_code,
    attachments: formData.value.attachments.map(file => file.name)
  }

  emit('submit', submitData)
}

const handlePayment = async () => {
  if (!canProceedToPayment.value) return
  
  try {
    isProcessingPayment.value = true
    
    // Simuler le paiement des frais d'étude de dossier
    // En réalité, ceci redirigerait vers une plateforme de paiement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    isPaymentCompleted.value = true
    
    // Afficher un message de succès
    console.log('Paiement des frais d\'étude de dossier effectué avec succès')
    
  } catch (error) {
    console.error('Erreur lors du paiement:', error)
  } finally {
    isProcessingPayment.value = false
  }
}

const validateAttachments = (files: File[]) => {
  if (!files || files.length === 0) return true

  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]

  for (const file of files) {
    if (file.size > maxSize) {
      return 'Fichier trop volumineux (max 5MB)'
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Type de fichier non autorisé'
    }
  }

  return true
}

const clearError = () => {
  emit('cancel')
}

const loadSessions = async () => {
  try {
    isLoadingSessions.value = true
    // TODO: Implémenter le chargement des sessions
    // const response = await trainingService.listTrainingSessions({ page: 1, page_size: 1000 })
    // sessionOptions.value = response.data.map(session => ({
    //   id: session.id,
    //   title: `${session.training?.title} - ${formatDate(session.start_date)}`,
    //   training_title: session.training?.title || '',
    //   start_date: session.start_date,
    //   end_date: session.end_date
    // }))
  } catch (error) {
    console.error('Erreur lors du chargement des sessions:', error)
  } finally {
    isLoadingSessions.value = false
  }
}

// Pas de watchers nécessaires - création uniquement

// Lifecycle
onMounted(() => {
  loadSessions()
})

</script>

<style scoped>
.v-file-input :deep(.v-field__input) {
  min-height: 40px;
}
</style>

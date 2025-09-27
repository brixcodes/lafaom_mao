

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const { createUser, isLoading } = useUsers()


// Form data
const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  user_type: '',
  status: 'active',
  civility: '',
  mobile_number: '',
  country_code: '',
  lang: 'fr',
  two_factor_enabled: false,
  birth_date: null,
  fix_number: null,
  web_token: null
})

// Form ref
const form = ref()

// Options
const userTypeOptions = [
  { title: 'Admin', value: 'admin' },
  { title: 'Staff', value: 'staff' },
  { title: 'Teacher', value: 'teacher' },
  { title: 'Student', value: 'student' }
]

const statusOptions = [
  { title: 'Actif', value: 'active' },
  { title: 'Inactif', value: 'inactive' },
  { title: 'Bloqué', value: 'blocked' }
]

const civilityOptions = [
  { title: 'Monsieur', value: 'Mr' },
  { title: 'Madame', value: 'Mme' },
  { title: 'Mademoiselle', value: 'Mlle' }
]

const languageOptions = [
  { title: 'Français', value: 'fr' },
  { title: 'English', value: 'en' }
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
  { title: 'Arabie saoudite', value: 'SA' },
  { title: 'Argentine', value: 'AR' },
  { title: 'Arménie', value: 'AM' },
  { title: 'Australie', value: 'AU' },
  { title: 'Autriche', value: 'AT' },
  { title: 'Azerbaïdjan', value: 'AZ' },
  { title: 'Bahamas', value: 'BS' },
  { title: 'Bahreïn', value: 'BH' },
  { title: 'Bangladesh', value: 'BD' },
  { title: 'Barbade', value: 'BB' },
  { title: 'Belarus', value: 'BY' },
  { title: 'Belgique', value: 'BE' },
  { title: 'Belize', value: 'BZ' },
  { title: 'Bénin', value: 'BJ' },
  { title: 'Bhoutan', value: 'BT' },
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
  { title: 'République centrafricaine', value: 'CF' },
  { title: 'Chili', value: 'CL' },
  { title: 'Chine', value: 'CN' },
  { title: 'Chypre', value: 'CY' },
  { title: 'Colombie', value: 'CO' },
  { title: 'Comores', value: 'KM' },
  { title: 'République du Congo', value: 'CG' },
  { title: 'République démocratique du Congo', value: 'CD' },
  { title: 'Corée du Nord', value: 'KP' },
  { title: 'Corée du Sud', value: 'KR' },
  { title: 'Costa Rica', value: 'CR' },
  { title: 'Côte d\'Ivoire', value: 'CI' },
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
  { title: 'Îles Salomon', value: 'SB' },
  { title: 'Inde', value: 'IN' },
  { title: 'Indonésie', value: 'ID' },
  { title: 'Iran', value: 'IR' },
  { title: 'Irak', value: 'IQ' },
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
  { title: 'Koweït', value: 'KW' },
  { title: 'Laos', value: 'LA' },
  { title: 'Lesotho', value: 'LS' },
  { title: 'Lettonie', value: 'LV' },
  { title: 'Liban', value: 'LB' },
  { title: 'Libéria', value: 'LR' },
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
  { title: 'Myanmar', value: 'MM' },
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
  { title: 'Roumanie', value: 'RO' },
  { title: 'Royaume-Uni', value: 'GB' },
  { title: 'Russie', value: 'RU' },
  { title: 'Rwanda', value: 'RW' },
  { title: 'Saint-Christophe-et-Niévès', value: 'KN' },
  { title: 'Saint-Marin', value: 'SM' },
  { title: 'Saint-Vincent-et-les-Grenadines', value: 'VC' },
  { title: 'Sainte-Lucie', value: 'LC' },
  { title: 'Samoa', value: 'WS' },
  { title: 'Sao Tomé-et-Principe', value: 'ST' },
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
  { title: 'Eswatini', value: 'SZ' },
  { title: 'Syrie', value: 'SY' },
  { title: 'Tadjikistan', value: 'TJ' },
  { title: 'Tanzanie', value: 'TZ' },
  { title: 'Tchad', value: 'TD' },
  { title: 'Tchéquie', value: 'CZ' },
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
  { title: 'Yémen', value: 'YE' },
  { title: 'Zambie', value: 'ZM' },
  { title: 'Zimbabwe', value: 'ZW' }
]


// Methods
const goBack = () => {
  router.push('/users')
}

const onCountryChange = (country: any) => {
  if (country) {
    if (typeof country === 'string') {
      formData.value.country_code = country
    } else {
      formData.value.country_code = country.value
    }
  } else {
    formData.value.country_code = ''
  }
}

const handleSubmit = async () => {
  const validation = await form.value?.validate()
  if (!validation?.valid) return

  // Confirmation avant soumission
  const confirmed = await confirmAction({
    method: 'post',
    title: 'Êtes vous sûres?',
    html: `Souhaitez-vous réellement le compte de l'utilisateur <b>${formData.value.first_name} ${formData.value.last_name}</b> ?`,
    confirmButtonText: '<span style="color:white">Enregistrer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await createUser(formData.value)
    showToast({
      message: 'Utilisateur créé avec succès',
      type: 'success'
    })
    router.push('/users')
  } catch (error) {
    showToast({
      message: 'Erreur lors de la création de l\'utilisateur',
      type: 'error'
    })
  }
}

const resetForm = () => {
  formData.value = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    user_type: '',
    status: 'active',
    civility: '',
    mobile_number: '',
    country_code: '',
    lang: 'fr',
    two_factor_enabled: false,
    birth_date: null,
    fix_number: null,
    web_token: null
  }
  form.value?.reset()
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h4 font-weight-bold">
          <VIcon icon="ri-arrow-left-line" color="primary" class="me-2" @click="goBack" />
          Créer un utilisateur
        </h2>
        <p class="text-body-1 text-medium-emphasis ml-5 mt-1">
          Ajoutez un nouvel utilisateur au système
        </p>
      </div>
    </div>

    <!-- Formulaire de création -->
    <VCard>
      <VCardText>
        <VForm ref="form" @submit.prevent="handleSubmit">
          <VRow>
            <!-- Informations personnelles -->
             <VCol cols="12" md="6">
               <VTextField v-model="formData.first_name" label="Prénom" variant="outlined"
                 prepend-inner-icon="ri-user-line"
                 :rules="[v => !!v || 'Le prénom est requis']" required />
             </VCol>

             <VCol cols="12" md="6">
               <VTextField v-model="formData.last_name" label="Nom" variant="outlined"
                 prepend-inner-icon="ri-user-line"
                 :rules="[v => !!v || 'Le nom est requis']" required />
             </VCol>

             <VCol cols="12" md="6">
               <VTextField v-model="formData.email" label="Email" type="email" variant="outlined"
                 prepend-inner-icon="ri-mail-line"
                 :rules="[v => !!v || 'L\'email est requis', v => /.+@.+\..+/.test(v) || 'Email invalide']" required />
             </VCol>

             <VCol cols="12" md="6">
               <VTextField v-model="formData.password" label="Mot de passe" type="password" variant="outlined"
                 prepend-inner-icon="ri-lock-line"
                 :rules="[v => !!v || 'Le mot de passe est requis', v => v.length >= 6 || 'Minimum 6 caractères']"
                 required />
             </VCol>

             <VCol cols="12" md="6">
               <VSelect v-model="formData.user_type" :items="userTypeOptions" label="Type d'utilisateur"
                 prepend-inner-icon="ri-user-settings-line"
                 variant="outlined" :rules="[v => !!v || 'Le type d\'utilisateur est requis']" required />
             </VCol>

             <VCol cols="12" md="6">
               <VSelect v-model="formData.status" :items="statusOptions" label="Statut" variant="outlined"
                 prepend-inner-icon="ri-shield-check-line"
                 :rules="[v => !!v || 'Le statut est requis']" required />
             </VCol>

             <VCol cols="12" md="6">
               <VSelect v-model="formData.civility" :items="civilityOptions" label="Civilité" variant="outlined"
                 prepend-inner-icon="ri-user-heart-line" />
             </VCol>

             <VCol cols="12" md="6">
               <VTextField v-model="formData.mobile_number" label="Numéro de mobile" variant="outlined"
                 prepend-inner-icon="ri-smartphone-line" />
             </VCol>

             <VCol cols="12" md="6">
               <VTextField v-model="formData.fix_number" label="Numéro de téléphone fixe" variant="outlined"
                 prepend-inner-icon="ri-phone-line" />
             </VCol>

            <VCol cols="12" md="6">
              <VAutocomplete v-model="formData.country_code" :items="countryOptions" label="Pays"
                prepend-inner-icon="ri-flag-line" variant="outlined" item-title="title" item-value="value" clearable
                no-data-text="Aucun pays trouvé" @update:model-value="onCountryChange" />
            </VCol>

            <VCol cols="12" md="6">
              <VSelect v-model="formData.lang" :items="languageOptions" label="Langue"
                prepend-inner-icon="ri-translate-2" variant="outlined" />
            </VCol>

             <!-- Date de naissance -->
             <VCol cols="12" md="6">
               <VTextField v-model="formData.birth_date" label="Date de naissance" type="date" variant="outlined"
                 prepend-inner-icon="ri-calendar-line" />
             </VCol>

            <!-- Authentification à deux facteurs -->
            <VCol cols="12" md="6">
              <VSwitch v-model="formData.two_factor_enabled" label="Authentification à deux facteurs" color="primary" />
            </VCol>
          </VRow>

          <VDivider />

          <!-- Boutons d'action -->
          <div class="d-flex justify-end gap-3 mt-6">
            <VBtn color="error" variant="outlined" @click="resetForm">
              Annuler
            </VBtn>
            <VBtn type="submit" color="primary" :loading="isLoading">
              <VIcon icon="ri-save-line" class="me-2" />
              Enregistrer
            </VBtn>
          </div>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
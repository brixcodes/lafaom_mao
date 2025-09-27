<template>
  <VContainer class="user-profile-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Mon profil</h1>
          <p class="text-body-2 text-secondary mb-0">
            Gérez vos informations personnelles et professionnelles.
          </p>
        </div>
      </div>

      <!-- Partie droite : boutons d'action -->
      <div>
        <VBtn color="primary" variant="outlined" @click="refreshProfile" class="action-btn mx-1"
          prepend-icon="ri-refresh-line">
          Actualiser
        </VBtn>
        <VBtn color="primary" @click="editMode = !editMode" class="action-btn" prepend-icon="ri-edit-line">
          {{ editMode ? 'Annuler' : 'Modifier' }}
        </VBtn>
      </div>
    </div>

    <VFadeTransition>
      <VRow v-if="user">
        <VCol cols="12">
          <!-- En-tête avec design moderne -->
          <VSlideYTransition>
            <VCard class="mb-6 user-profile-header-card overflow-hidden" elevation="3">
              <div class="user-profile-header-overlay">
                <div class="user-profile-header-content">
                  <div class="d-flex align-center mb-4 animate-user">
                    <VAvatar size="48" class="mr-3 border-white">
                      <img v-if="user?.picture" :src="user.picture" :alt="`${user.first_name} ${user.last_name}`"
                        style="width: 100%; height: 100%; object-fit: cover;" />
                      <VIcon v-else color="white" size="24">ri-user-line</VIcon>
                    </VAvatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ user.user_type || 'Utilisateur' }}</div>
                      <div class="text-caption text-white">
                        ID: {{ user.id }}
                      </div>
                    </div>
                  </div>

                  <h1 class="text-h3 font-weight-bold text-white mb-4 animate-title">
                    {{ user.first_name }} {{ user.last_name }}
                  </h1>

                  <div class="d-flex flex-wrap gap-3 mb-4">
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-mail-line</VIcon>
                      <span>{{ user.email }}</span>
                    </div>
                    <div v-if="user.mobile_number" class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-phone-line</VIcon>
                      <span>{{ user.mobile_number }}</span>
                    </div>
                    <div class="d-flex align-center text-white">
                      <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                      <span>Membre depuis {{ formatDate(user.created_at) }}</span>
                    </div>
                  </div>

                  <VSlideXTransition group>
                    <VChip key="user-status" :color="statusChip.color" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      <VIcon :icon="statusChip.icon" class="me-1" />
                      {{ statusChip.text }}
                    </VChip>
                    <VChip key="user-type" color="white" variant="outlined" size="small" class="mr-2 mb-2 animate-tag">
                      {{ user.user_type }}
                    </VChip>
                    <VChip v-if="user.two_factor_enabled" key="2fa" color="success" variant="elevated" size="small"
                      class="mr-2 mb-2 animate-tag">
                      <VIcon icon="ri-shield-check-line" class="me-1" />
                      2FA Activé
                    </VChip>
                  </VSlideXTransition>
                </div>
              </div>
            </VCard>
          </VSlideYTransition>

          <!-- Contenu principal -->
          <VRow>
            <VCol cols="12" md="8">
              <!-- Informations personnelles -->
              <VSlideYTransition>
                <VCard v-if="user" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-user-settings-line</VIcon>
                    <span class="text-h6">Informations personnelles</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <v-timeline align="start" density="compact" class="pa-3">
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Informations de base</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Nom: {{ user.first_name }} {{ user.last_name }}</div>
                          <div>Email: {{ user.email }}</div>
                          <div>Téléphone: {{ user.mobile_number || 'Non défini' }}</div>
                          <div>Date de naissance: {{ formatBirthDate(user.birth_date) }}</div>
                          <div>Civilité: {{ user.civility || 'Non définie' }}</div>
                        </div>
                      </v-timeline-item>
                      <v-timeline-item size="x-small">
                        <div class="font-weight-medium mb-2"><strong>Informations de compte</strong> :</div>
                        <div style="margin-left: 10px; line-height: 1.8;">
                          <div>Type d'utilisateur: {{ user.user_type }}</div>
                          <div>Statut: {{ getStatusLabel(user.status) }}</div>
                          <div>Langue: {{ user.lang || 'Français' }}</div>
                          <div>2FA Activé: {{ user.two_factor_enabled ? 'Oui' : 'Non' }}</div>
                          <div>Dernière connexion: {{ formatDate(user.last_login) }}</div>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>


             <!-- Sidebar avec informations et actions -->
             <VCol cols="12" md="4">
              <VSlideXReverseTransition>
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                    <span class="text-h6">Informations du compte</span>
                  </VCardTitle>
                  <VDivider />
                  <VList lines="two" density="comfortable">
                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-user-line</VIcon>
                      </template>
                      <VListItemTitle>Nom complet</VListItemTitle>
                      <VListItemSubtitle>{{ user.first_name }} {{ user.last_name }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-mail-line</VIcon>
                      </template>
                      <VListItemTitle>Email</VListItemTitle>
                      <VListItemSubtitle class="font-weight-medium">{{ user.email }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-phone-line</VIcon>
                      </template>
                      <VListItemTitle>Téléphone</VListItemTitle>
                      <VListItemSubtitle>{{ user.mobile_number || 'Non défini' }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-calendar-line</VIcon>
                      </template>
                      <VListItemTitle>Date de naissance</VListItemTitle>
                      <VListItemSubtitle>{{ formatBirthDate(user.birth_date) }}</VListItemSubtitle>
                    </VListItem>

                    <VListItem>
                      <template #prepend>
                        <VIcon color="primary">ri-shield-user-line</VIcon>
                      </template>
                      <VListItemTitle>Type d'utilisateur</VListItemTitle>
                      <VListItemSubtitle>{{ user.user_type }}</VListItemSubtitle>
                    </VListItem>
                  </VList>

                  <!-- Actions -->
                  <VDivider />
                  <VCardText class="pa-4">
                    <div class="d-flex flex-column gap-3">
                      <VBtn :color="editMode ? 'error' : 'primary'" :prepend-icon="editMode ? 'ri-close-line' : 'ri-edit-line'" @click="editMode = !editMode" block>
                        {{ editMode ? 'Annuler' : 'Modifier le profil' }}
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VSlideXReverseTransition>
            </VCol>
          </VRow>
          
          <VRow>
            <VCol cols="12" md="12">
              <!-- Informations personnelles - Mode édition -->
              <VSlideYTransition v-if="editMode">
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-user-settings-line</VIcon>
                    <span class="text-h6">Modifier les informations personnelles</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VForm @submit.prevent="updateProfile">
                      <VRow>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.first_name" label="Prénom" variant="outlined"
                            :rules="[v => !!v || 'Le prénom est requis']" required />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.last_name" label="Nom" variant="outlined"
                            :rules="[v => !!v || 'Le nom est requis']" required />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VSelect v-model="editableProfile.civility" :items="civilityOptions" label="Civilité"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.birth_date" label="Date de naissance" type="date"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.mobile_number" label="Téléphone mobile"
                            variant="outlined" type="tel" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.fix_number" label="Téléphone fixe" variant="outlined"
                            type="tel" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VSelect v-model="editableProfile.country_code" :items="countryOptions" label="Code pays"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VSelect v-model="editableProfile.lang" :items="languageOptions" label="Langue"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12">
                          <VSwitch v-model="editableProfile.two_factor_enabled" label="Authentification à deux facteurs"
                            color="primary" />
                        </VCol>
                        <VCol cols="12">
                          <VBtn type="submit" color="primary" class="mr-2" :loading="loading">
                            Sauvegarder les informations
                          </VBtn>
                          <VBtn @click="cancelEdit" variant="text">
                            Annuler
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Informations professionnelles -->
              <VSlideYTransition>
                <VCard v-if="user?.professions_status" class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-briefcase-line</VIcon>
                    <span class="text-h6">Informations professionnelles</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VRow v-if="!editMode">
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <div class="text-body-2 text-medium-emphasis mb-1">Poste actuel</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ user?.professions_status?.job_position || 'Non défini' }}
                          </div>
                        </div>
                      </VCol>
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <div class="text-body-2 text-medium-emphasis mb-1">Employeur</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ user?.professions_status?.employer || 'Non défini' }}
                          </div>
                        </div>
                      </VCol>
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <div class="text-body-2 text-medium-emphasis mb-1">Expérience</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ formatExperience(user?.professions_status?.professional_experience_in_months) }}
                          </div>
                        </div>
                      </VCol>
                      <VCol cols="12" md="6">
                        <div class="mb-4">
                          <div class="text-body-2 text-medium-emphasis mb-1">Catégorie professionnelle</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ user?.professions_status?.socio_professional_category || 'Non définie' }}
                          </div>
                        </div>
                      </VCol>
                    </VRow>

                    <!-- Mode édition professionnel -->
                    <VForm v-else @submit.prevent="updateProfessionalInfo">
                      <VRow>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.job_position" label="Poste actuel" variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.employer" label="Employeur" variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.professional_experience_in_months"
                            label="Expérience (en mois)" type="number" variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableProfile.socio_professional_category"
                            label="Catégorie professionnelle" variant="outlined" />
                        </VCol>
                        <VCol cols="12">
                          <VBtn type="submit" color="primary" class="mr-2" :loading="loading">
                            Sauvegarder
                          </VBtn>
                          <VBtn @click="cancelEdit" variant="text">
                            Annuler
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Adresses -->
              <VSlideYTransition v-if="editMode">
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-map-pin-line</VIcon>
                    <span class="text-h6">Adresses</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VForm @submit.prevent="updateAddresses">
                      <VRow>
                        <VCol cols="12">
                          <h4 class="text-h6 mb-4">Adresse principale</h4>
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.primary_address_country_code" label="Code pays"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.primary_address_city" label="Ville"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.primary_address_street" label="Rue"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.primary_address_postal_code" label="Code postal"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.primary_address_state" label="État/Région"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12">
                          <h4 class="text-h6 mb-4 mt-4">Adresse de facturation</h4>
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.billing_address_country_code" label="Code pays"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.billing_address_city" label="Ville"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.billing_address_street" label="Rue"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.billing_address_postal_code" label="Code postal"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextField v-model="editableAddresses.billing_address_state" label="État/Région"
                            variant="outlined" />
                        </VCol>
                        <VCol cols="12">
                          <VBtn type="submit" color="primary" class="mr-2" :loading="loading">
                            Sauvegarder les adresses
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VSlideYTransition>

              <!-- Upload d'image de profil -->
              <VSlideYTransition v-if="editMode">
                <VCard class="mb-6 animate-card" elevation="1">
                  <VCardTitle class="d-flex align-center">
                    <VIcon color="primary" class="mr-2">ri-image-line</VIcon>
                    <span class="text-h6">Photo de profil</span>
                  </VCardTitle>
                  <VDivider />
                  <VCardText class="py-4">
                    <VRow>
                      <VCol cols="12" md="4">
                        <div class="text-center">
                          <VAvatar size="120" class="mb-4">
                            <img v-if="user?.picture" :src="user.picture" :alt="`${user.first_name} ${user.last_name}`"
                              style="width: 100%; height: 100%; object-fit: cover;" />
                            <VIcon v-else icon="ri-user-line" size="60" />
                          </VAvatar>
                        </div>
                      </VCol>
                      <VCol cols="12" md="8">
                        <VFileInput v-model="profileImage" label="Sélectionner une image" accept="image/*"
                          prepend-icon="ri-upload-line" variant="outlined" @change="handleImageUpload" />
                        <VBtn color="primary" @click="uploadProfileImage" :loading="uploadingImage" class="mt-2"
                          :disabled="!profileImage">
                          <VIcon icon="ri-upload-line" class="me-2" />
                          Télécharger l'image
                        </VBtn>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VSlideYTransition>
            </VCol>

           
          </VRow>
        </VCol>
      </VRow>
    </VFadeTransition>

    <!-- États de chargement et d'erreur -->
    <VFadeTransition>
      <VRow v-if="loading && !user">
        <VCol cols="12" class="text-center py-8">
          <VProgressCircular indeterminate color="primary" size="64" width="6" />
          <div class="mt-4 text-body-1 animate-fade-in">Chargement du profil...</div>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!loading && !user && error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="error" class="mb-4 animate-bounce">ri-alert-circle-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Erreur de chargement</div>
          <div class="text-body-1 mb-6 animate-fade-in">{{ error }}</div>
          <VBtn color="primary" size="large" @click="fetchUserProfile" prepend-icon="ri-refresh-line"
            class="animate-fade-in">
            Réessayer
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>

    <VFadeTransition>
      <VRow v-if="!loading && !user && !error">
        <VCol cols="12" class="text-center py-8">
          <VIcon size="x-large" color="primary" class="mb-4 animate-bounce">ri-user-line</VIcon>
          <div class="text-h5 mb-3 animate-fade-in">Profil introuvable</div>
          <div class="text-body-1 mb-6 animate-fade-in">Votre profil n'a pas pu être chargé.
          </div>
          <VBtn color="primary" size="large" @click="goBack" prepend-icon="ri-arrow-left-line" class="animate-fade-in">
            Retour au tableau de bord
          </VBtn>
        </VCol>
      </VRow>
    </VFadeTransition>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { usersService } from '@/services/api/users'
import { authService } from '@/services/api/auth'
import { showToast } from '@/components/toast/toastManager'

// Store
const authStore = useAuthStore()

// State
const user = ref<any>(null)
const activeTab = ref('profile')
const editMode = ref(false)
const loading = ref(false)
const error = ref('')

// Form data for editing
const editableProfile = ref({
  first_name: '',
  last_name: '',
  birth_date: '',
  civility: '',
  country_code: '',
  mobile_number: '',
  fix_number: '',
  two_factor_enabled: false,
  lang: '',
  job_position: '',
  employer: '',
  professional_experience_in_months: 0,
  socio_professional_category: ''
})

const editableAddresses = ref({
  primary_address_country_code: '',
  primary_address_city: '',
  primary_address_street: '',
  primary_address_postal_code: '',
  primary_address_state: '',
  billing_address_country_code: '',
  billing_address_city: '',
  billing_address_street: '',
  billing_address_postal_code: '',
  billing_address_state: ''
})

const profileImage = ref(null)
const uploadingImage = ref(false)

// Options for selects
const civilityOptions = [
  { title: 'Monsieur', value: 'Mr' },
  { title: 'Madame', value: 'Mme' },
  { title: 'Mademoiselle', value: 'Mlle' }
]

const countryOptions = [
  { title: 'Cameroun', value: 'CM' },
  { title: 'France', value: 'FR' },
  { title: 'Canada', value: 'CA' },
  { title: 'Belgique', value: 'BE' },
  { title: 'Suisse', value: 'CH' }
]

const languageOptions = [
  { title: 'Français', value: 'fr' },
  { title: 'English', value: 'en' },
  { title: 'Español', value: 'es' }
]

// Computed
const statusChip = computed(() => {
  if (!user.value) return { text: '', color: 'grey', icon: 'ri-question-line' }

  const status = user.value.status
  const statusConfig: Record<string, { text: string; color: string; icon: string }> = {
    active: { text: 'Actif', color: 'success', icon: 'ri-check-line' },
    inactive: { text: 'Inactif', color: 'warning', icon: 'ri-time-line' },
    blocked: { text: 'Bloqué', color: 'error', icon: 'ri-close-line' },
    deleted: { text: 'Supprimé', color: 'error', icon: 'ri-close-line' }
  }

  return statusConfig[status] || { text: status, color: 'grey', icon: 'ri-question-line' }
})

// Methods
const fetchUserProfile = async () => {
  try {
    loading.value = true

    // Essayer d'abord d'obtenir le profil complet
    try {
      const profileData = await authService.getMe()
      user.value = profileData.data || profileData
    } catch (fullProfileError) {
      console.log('Profil complet non disponible, utilisation du profil de base')

      // Fallback sur l'utilisateur actuel du store
      const currentUser = authStore.user
      if (currentUser) {
        user.value = currentUser
      } else {
        console.error('Aucun utilisateur trouvé')
        return
      }
    }

    // Populate editable fields
    if (user.value) {
      editableProfile.value = {
        first_name: user.value.first_name || '',
        last_name: user.value.last_name || '',
        birth_date: user.value.birth_date || '',
        civility: user.value.civility || '',
        country_code: user.value.country_code || '',
        mobile_number: user.value.mobile_number || '',
        fix_number: user.value.fix_number || '',
        two_factor_enabled: user.value.two_factor_enabled || false,
        lang: user.value.lang || 'fr',
        job_position: user.value.professions_status?.job_position || '',
        employer: user.value.professions_status?.employer || '',
        professional_experience_in_months: user.value.professions_status?.professional_experience_in_months || 0,
        socio_professional_category: user.value.professions_status?.socio_professional_category || ''
      }

      // Populate addresses if available
      if (user.value.addresses && user.value.addresses.length > 0) {
        const primaryAddress = user.value.addresses.find((addr: any) => addr.id === 1) // Assuming primary address has id 1
        const billingAddress = user.value.addresses.find((addr: any) => addr.id === 2) // Assuming billing address has id 2

        if (primaryAddress) {
          editableAddresses.value.primary_address_country_code = primaryAddress.country_code || ''
          editableAddresses.value.primary_address_city = primaryAddress.city || ''
          editableAddresses.value.primary_address_street = primaryAddress.street || ''
          editableAddresses.value.primary_address_postal_code = primaryAddress.postal_code || ''
          editableAddresses.value.primary_address_state = primaryAddress.state || ''
        }

        if (billingAddress) {
          editableAddresses.value.billing_address_country_code = billingAddress.country_code || ''
          editableAddresses.value.billing_address_city = billingAddress.city || ''
          editableAddresses.value.billing_address_street = billingAddress.street || ''
          editableAddresses.value.billing_address_postal_code = billingAddress.postal_code || ''
          editableAddresses.value.billing_address_state = billingAddress.state || ''
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  try {
    loading.value = true
    const profileData = {
      first_name: editableProfile.value.first_name,
      last_name: editableProfile.value.last_name,
      birth_date: editableProfile.value.birth_date,
      civility: editableProfile.value.civility,
      country_code: editableProfile.value.country_code,
      mobile_number: editableProfile.value.mobile_number,
      fix_number: editableProfile.value.fix_number,
      two_factor_enabled: editableProfile.value.two_factor_enabled,
      lang: editableProfile.value.lang
    }

    await authService.updateProfile(profileData)
    showToast({
      message: 'Profil mis à jour avec succès',
      type: 'success'
    })

    // Refresh user data
    await fetchUserProfile()
    editMode.value = false
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error)
    showToast({
      message: error.response?.data?.message || 'Erreur lors de la mise à jour du profil',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const updateAddresses = async () => {
  try {
    loading.value = true
    await authService.updateAddresses(editableAddresses.value)
    showToast({
      message: 'Adresses mises à jour avec succès',
      type: 'success'
    })

    // Refresh user data
    await fetchUserProfile()
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour des adresses:', error)
    showToast({
      message: error.response?.data?.message || 'Erreur lors de la mise à jour des adresses',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const updateProfessionalInfo = async () => {
  try {
    loading.value = true
    // API call to update professional information
    // await usersService.updateProfessionalInfo(user.value.id, editableProfile.value)
    console.log('Mise à jour des informations professionnelles:', editableProfile.value)
    editMode.value = false
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    loading.value = false
  }
}

const handleImageUpload = (event: any) => {
  const file = event.target.files[0]
  if (file) {
    profileImage.value = file
  }
}

const uploadProfileImage = async () => {
  if (!profileImage.value) return
  
  try {
    uploadingImage.value = true
    const formData = new FormData()
    formData.append('image', profileImage.value) // Le backend attend 'image' et non 'file'
    
    await authService.uploadProfileImage(formData)
    showToast({
      message: 'Image de profil mise à jour avec succès',
      type: 'success'
    })
    
    // Refresh user data
    await fetchUserProfile()
    profileImage.value = null
  } catch (error: any) {
    console.error('Erreur lors du téléchargement de l\'image:', error)
    showToast({
      message: error.response?.data?.message || 'Erreur lors du téléchargement de l\'image',
      type: 'error'
    })
  } finally {
    uploadingImage.value = false
  }
}

const goBack = () => {
  window.history.back()
}

const refreshProfile = async () => {
  await fetchUserProfile()
}

const goToSettings = () => {
  // TODO: Navigate to settings page
  console.log('Aller aux paramètres')
}

const cancelEdit = () => {
  editMode.value = false
  // Reset form
  if (user.value) {
    editableProfile.value = {
      first_name: user.value.first_name || '',
      last_name: user.value.last_name || '',
      birth_date: user.value.birth_date || '',
      civility: user.value.civility || '',
      country_code: user.value.country_code || '',
      mobile_number: user.value.mobile_number || '',
      fix_number: user.value.fix_number || '',
      two_factor_enabled: user.value.two_factor_enabled || false,
      lang: user.value.lang || 'fr',
      job_position: user.value.professions_status?.job_position || '',
      employer: user.value.professions_status?.employer || '',
      professional_experience_in_months: user.value.professions_status?.professional_experience_in_months || 0,
      socio_professional_category: user.value.professions_status?.socio_professional_category || ''
    }
  }

  // Reset addresses
  editableAddresses.value = {
    primary_address_country_code: '',
    primary_address_city: '',
    primary_address_street: '',
    primary_address_postal_code: '',
    primary_address_state: '',
    billing_address_country_code: '',
    billing_address_city: '',
    billing_address_street: '',
    billing_address_postal_code: '',
    billing_address_state: ''
  }

  // Reset image
  profileImage.value = null
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'active': 'success',
    'inactive': 'warning',
    'blocked': 'error',
    'deleted': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'blocked': 'Bloqué',
    'deleted': 'Supprimé'
  }
  return labels[status] || status
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Non défini'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatBirthDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Non définie'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return 'À l\'instant'
  if (diffHours < 24) return `Il y a ${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  return `Il y a ${diffDays}j`
}

const formatExperience = (months: number | null | undefined) => {
  if (!months) return 'Non définie'
  if (months < 12) return `${months} mois`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  return remainingMonths > 0 ? `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois` : `${years} an${years > 1 ? 's' : ''}`
}

// Lifecycle
onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.user-profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.user-profile-header-card {
  position: relative;
  overflow: hidden;
}

.user-profile-header-overlay {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
  color: white;
}

.user-profile-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.user-profile-header-content {
  position: relative;
  z-index: 2;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.animate-user {
  animation: slideInLeft 0.6s ease-out;
}

.animate-title {
  animation: slideInUp 0.8s ease-out;
}

.animate-tag {
  animation: fadeInUp 1s ease-out;
}

.animate-card {
  animation: slideInUp 0.6s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .user-profile-container {
    padding: 1rem;
  }

  .user-profile-header-overlay {
    padding: 1.5rem;
  }

  .user-profile-header-content h1 {
    font-size: 1.5rem !important;
  }
}
</style>
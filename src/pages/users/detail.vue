<template>
  <VContainer class="user-detail-container">
    <!-- Header avec navigation -->
    <div class="d-flex justify-space-between align-center mb-4">
      <!-- Partie gauche : bouton retour + titres -->
      <div class="d-flex align-center">
        <VBtn icon variant="text" class="mr-3" @click="goBack">
          <VIcon icon="ri-arrow-left-line" color="primary" />
        </VBtn>
        <div>
          <h1 class="font-weight-bold mb-1">Détails de l'utilisateur</h1>
          <p class="text-body-2 text-secondary mb-0">
            Consultez les informations détaillées de l'utilisateur.
          </p>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="text-center py-12">
      <VProgressCircular indeterminate size="60" width="6" color="primary" class="mb-4" />
      <p class="text-body-1 text-medium-emphasis">Chargement de l'utilisateur...</p>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error" type="error" class="mb-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <VFadeTransition>
      <div v-if="user">
        <VRow>
          <VCol cols="12">
            <!-- En-tête avec design moderne -->
            <VSlideYTransition>
              <VCard class="mb-6 user-header-card overflow-hidden" elevation="3">
                <div class="user-header-overlay">
                  <div class="user-header-content">
                    <div class="d-flex align-center mb-4 animate-company">
                      <VAvatar size="48" class="mr-3 border-white">
                        <VImg v-if="user.picture" :src="user.picture" />
                        <VIcon v-else color="white" size="24">ri-user-line</VIcon>
                      </VAvatar>
                      <div>
                        <div class="text-white font-weight-medium">Utilisateur</div>
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
                      <div class="d-flex align-center text-white">
                        <VIcon size="small" class="mr-2">ri-calendar-line</VIcon>
                        <span>Créé le {{ formatDate(user.created_at) }}</span>
                      </div>
                    </div>

                    <VSlideXTransition group>
                      <VChip key="user-type" :color="getUserTypeColor(user.user_type)" variant="elevated" size="small"
                        class="mr-2 mb-2 animate-tag">
                        {{ getUserTypeLabel(user.user_type) }}
                      </VChip>
                      <VChip key="status" :color="getStatusColor(user.status)" variant="elevated" size="small"
                        class="mr-2 mb-2 animate-tag">
                        {{ getStatusLabel(user.status) }}
                      </VChip>
                      <VChip key="two-factor" v-if="user.two_factor_enabled" color="success" variant="elevated"
                        size="small" class="mr-2 mb-2 animate-tag">
                        2FA Activé
                      </VChip>
                    </VSlideXTransition>
                  </div>
                </div>
              </VCard>
            </VSlideYTransition>

            <!-- Contenu principal -->
            <VRow>
              <VCol cols="12" md="12">
                <!-- Informations personnelles -->
                <VSlideXReverseTransition>
                  <VCard class="mb-6 animate-card" elevation="1">
                    <VCardTitle class="d-flex align-center">
                      <VIcon color="primary" class="mr-2">ri-information-line</VIcon>
                      <span class="text-h6">Informations de l'utilisateur</span>
                    </VCardTitle>
                    <VDivider />
                    <VRow>
                      <VCol cols="12" md="4">
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
                            <VListItemSubtitle>{{ user.email }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-shield-user-line</VIcon>
                            </template>
                            <VListItemTitle>Type d'utilisateur</VListItemTitle>
                            <VListItemSubtitle>{{ getUserTypeLabel(user.user_type) }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-checkbox-circle-line</VIcon>
                            </template>
                            <VListItemTitle>Statut</VListItemTitle>
                            <VListItemSubtitle>{{ getStatusLabel(user.status) }}</VListItemSubtitle>
                          </VListItem>
                        </VList>
                      </VCol>


                      <VCol cols="12" md="4">
                        <VList lines="two" density="comfortable">
                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-translate-2</VIcon>
                            </template>
                            <VListItemTitle>Langue</VListItemTitle>
                            <VListItemSubtitle>{{ getLanguageLabel(user.lang) }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-cellphone-line</VIcon>
                            </template>
                            <VListItemTitle>Téléphone mobile</VListItemTitle>
                            <VListItemSubtitle>{{ user.mobile_number || 'Non défini' }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-shield-user-line</VIcon>
                            </template>
                            <VListItemTitle>Téléphone fixe</VListItemTitle>
                            <VListItemSubtitle>{{ user.fix_number || 'Non défini' }}</VListItemSubtitle>
                          </VListItem>


                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-account-pin-circle-line</VIcon>
                            </template>
                            <VListItemTitle>Pays Résidence</VListItemTitle>
                            <VListItemSubtitle>{{ getCountryLabel(user.country_code) }}</VListItemSubtitle>
                          </VListItem>
                        </VList>
                      </VCol>


                      <VCol cols="12" md="4">
                        <VList lines="two" density="comfortable">

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-edit-line</VIcon>
                            </template>
                            <VListItemTitle>Dernière modification</VListItemTitle>
                            <VListItemSubtitle>{{ formatDate(user.created_at) }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem v-if="user.two_factor_enabled">
                            <template #prepend>
                              <VIcon color="success">ri-shield-check-line</VIcon>
                            </template>
                            <VListItemTitle>Authentification à deux facteurs</VListItemTitle>
                            <VListItemSubtitle>Activée</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-checkbox-circle-line</VIcon>
                            </template>
                            <VListItemTitle>Statut</VListItemTitle>
                            <VListItemSubtitle>{{ getStatusLabel(user.status) }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-calendar-todo-line</VIcon>
                            </template>
                            <VListItemTitle>Date de création</VListItemTitle>
                            <VListItemSubtitle>{{ formatDate(user.created_at) }}</VListItemSubtitle>
                          </VListItem>

                          <VListItem v-if="user.two_factor_enabled">
                            <template #prepend>
                              <VIcon color="success">ri-shield-check-line</VIcon>
                            </template>
                            <VListItemTitle>Authentification à deux facteurs</VListItemTitle>
                            <VListItemSubtitle>Activée</VListItemSubtitle>
                          </VListItem>

                          <VListItem>
                            <template #prepend>
                              <VIcon color="primary">ri-flag-line</VIcon>
                            </template>
                            <VListItemTitle>Civilité</VListItemTitle>
                            <VListItemSubtitle>{{ getCivilityLabel(user.civility) }}</VListItemSubtitle>
                          </VListItem>
                        </VList>
                      </VCol>
                    </VRow>
                  </VCard>
                </VSlideXReverseTransition>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </div>
    </VFadeTransition>

    <!-- Utilisateur non trouvé -->
    <VFadeTransition>
      <VCard v-if="!isLoading && !user && !error">
        <VCardText class="text-center py-12">
          <VIcon icon="ri-error-warning-line" size="60" class="text-error mb-4" />
          <h3 class="text-h5 mb-2">Utilisateur non trouvé</h3>
          <p class="text-body-1 text-medium-emphasis mb-4">
            L'utilisateur que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <VBtn color="primary" :to="{ path: '/users' }">
            Retour à la liste
          </VBtn>
        </VCardText>
      </VCard>
    </VFadeTransition>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUsers } from '@/composables/useUsers'
import { usePermissions } from '@/composables/usePermissions'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const router = useRouter()
const route = useRoute()
const { loadUser, isLoading } = useUsers()

// Permissions
const { canViewUsers, canUpdateUsers, canDeleteUsers, canGivePermissions, canGiveRoles } = usePermissions()

const user = ref<any>(null)
const error = ref('')

// Computed
const userId = computed(() => route.params.id as string)

// Methods
const loadUserData = async () => {
  try {
    const response = await loadUser(userId.value)
    user.value = (response as any).data || (response as any)
  } catch (err: any) {
    console.error('Erreur lors du chargement de l\'utilisateur:', err)
    error.value = 'Erreur lors du chargement de l\'utilisateur'
  }
}

const confirmDelete = async () => {
  if (!user.value) return

  const confirmed = await confirmAction({
    title: 'Supprimer l\'utilisateur',
    text: `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.value.first_name} ${user.value.last_name}" ? Cette action est irréversible.`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (confirmed) {
    try {
      // Utiliser le composable useUsers pour la suppression
      const { deleteUser } = useUsers()
      await deleteUser(user.value.id)
      router.push({ name: 'users-index' })
    } catch (err: any) {
      // L'erreur est déjà gérée dans le composable useUsers
    }
  }
}

const clearError = () => {
  error.value = ''
}

const goBack = () => {
  router.back()
}

const goToEdit = () => {
  router.push({ path: `/users/${userId.value}/edit` })
}

const goToRoleManagement = () => {
  // Stocker l'utilisateur sélectionné pour la page de gestion des rôles
  sessionStorage.setItem('selectedUserForRoleManagement', JSON.stringify(user.value))
  router.push({ path: '/users/role-permissions' })
}

const goToIndex = () => {
  router.push({ path: '/users' })
}

const getUserTypeColor = (userType: string): string => {
  const colors: Record<string, string> = {
    admin: 'error',
    staff: 'warning',
    teacher: 'info',
    student: 'success'
  }
  return colors[userType] || 'primary'
}

const getUserTypeLabel = (userType: string): string => {
  const labels: Record<string, string> = {
    admin: 'Administrateur',
    staff: 'Personnel',
    teacher: 'Formateur',
    student: 'Étudiant'
  }
  return labels[userType] || userType
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
    deleted: 'error'
  }
  return colors[status] || 'primary'
}

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Actif',
    inactive: 'Inactif',
    blocked: 'Bloqué',
    deleted: 'Supprimé'
  }
  return labels[status] || status
}



const getLanguageLabel = (lang: string): string => {
  const labels: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ar: 'العربية',
    zh: '中文',
    ja: '日本語',
    ko: '한국어'
  }
  return labels[lang] || lang || 'Français'
}

const getCountryLabel = (countryCode: string): string => {
  const countries: Record<string, string> = {
    'AF': 'Afghanistan',
    'ZA': 'Afrique du Sud',
    'AL': 'Albanie',
    'DZ': 'Algérie',
    'DE': 'Allemagne',
    'AD': 'Andorre',
    'AO': 'Angola',
    'AG': 'Antigua-et-Barbuda',
    'SA': 'Arabie saoudite',
    'AR': 'Argentine',
    'AM': 'Arménie',
    'AU': 'Australie',
    'AT': 'Autriche',
    'AZ': 'Azerbaïdjan',
    'BS': 'Bahamas',
    'BH': 'Bahreïn',
    'BD': 'Bangladesh',
    'BB': 'Barbade',
    'BY': 'Belarus',
    'BE': 'Belgique',
    'BZ': 'Belize',
    'BJ': 'Bénin',
    'BT': 'Bhoutan',
    'BO': 'Bolivie',
    'BA': 'Bosnie-Herzégovine',
    'BW': 'Botswana',
    'BR': 'Brésil',
    'BN': 'Brunei',
    'BG': 'Bulgarie',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'KH': 'Cambodge',
    'CM': 'Cameroun',
    'CA': 'Canada',
    'CV': 'Cap-Vert',
    'CF': 'République centrafricaine',
    'CL': 'Chili',
    'CN': 'Chine',
    'CY': 'Chypre',
    'CO': 'Colombie',
    'KM': 'Comores',
    'CG': 'République du Congo',
    'CD': 'République démocratique du Congo',
    'KP': 'Corée du Nord',
    'KR': 'Corée du Sud',
    'CR': 'Costa Rica',
    'CI': 'Côte d\'Ivoire',
    'HR': 'Croatie',
    'CU': 'Cuba',
    'DK': 'Danemark',
    'DJ': 'Djibouti',
    'DM': 'Dominique',
    'EG': 'Égypte',
    'AE': 'Émirats arabes unis',
    'EC': 'Équateur',
    'ER': 'Érythrée',
    'ES': 'Espagne',
    'EE': 'Estonie',
    'US': 'États-Unis',
    'ET': 'Éthiopie',
    'FJ': 'Fidji',
    'FI': 'Finlande',
    'FR': 'France',
    'GA': 'Gabon',
    'GM': 'Gambie',
    'GE': 'Géorgie',
    'GH': 'Ghana',
    'GR': 'Grèce',
    'GD': 'Grenade',
    'GT': 'Guatemala',
    'GN': 'Guinée',
    'GW': 'Guinée-Bissau',
    'GQ': 'Guinée équatoriale',
    'GY': 'Guyana',
    'HT': 'Haïti',
    'HN': 'Honduras',
    'HU': 'Hongrie',
    'MH': 'Îles Marshall',
    'SB': 'Îles Salomon',
    'IN': 'Inde',
    'ID': 'Indonésie',
    'IR': 'Iran',
    'IQ': 'Irak',
    'IE': 'Irlande',
    'IS': 'Islande',
    'IL': 'Israël',
    'IT': 'Italie',
    'JM': 'Jamaïque',
    'JP': 'Japon',
    'JO': 'Jordanie',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KG': 'Kirghizistan',
    'KI': 'Kiribati',
    'KW': 'Koweït',
    'LA': 'Laos',
    'LS': 'Lesotho',
    'LV': 'Lettonie',
    'LB': 'Liban',
    'LR': 'Libéria',
    'LY': 'Libye',
    'LI': 'Liechtenstein',
    'LT': 'Lituanie',
    'LU': 'Luxembourg',
    'MK': 'Macédoine du Nord',
    'MG': 'Madagascar',
    'MY': 'Malaisie',
    'MW': 'Malawi',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malte',
    'MA': 'Maroc',
    'MU': 'Maurice',
    'MR': 'Mauritanie',
    'MX': 'Mexique',
    'FM': 'Micronésie',
    'MD': 'Moldavie',
    'MC': 'Monaco',
    'MN': 'Mongolie',
    'ME': 'Monténégro',
    'MZ': 'Mozambique',
    'MM': 'Myanmar',
    'NA': 'Namibie',
    'NR': 'Nauru',
    'NP': 'Népal',
    'NI': 'Nicaragua',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NO': 'Norvège',
    'NZ': 'Nouvelle-Zélande',
    'OM': 'Oman',
    'UG': 'Ouganda',
    'UZ': 'Ouzbékistan',
    'PK': 'Pakistan',
    'PW': 'Palaos',
    'PA': 'Panama',
    'PG': 'Papouasie-Nouvelle-Guinée',
    'PY': 'Paraguay',
    'NL': 'Pays-Bas',
    'PE': 'Pérou',
    'PH': 'Philippines',
    'PL': 'Pologne',
    'PT': 'Portugal',
    'QA': 'Qatar',
    'RO': 'Roumanie',
    'GB': 'Royaume-Uni',
    'RU': 'Russie',
    'RW': 'Rwanda',
    'KN': 'Saint-Christophe-et-Niévès',
    'SM': 'Saint-Marin',
    'VC': 'Saint-Vincent-et-les-Grenadines',
    'LC': 'Sainte-Lucie',
    'WS': 'Samoa',
    'ST': 'Sao Tomé-et-Principe',
    'SN': 'Sénégal',
    'RS': 'Serbie',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapour',
    'SK': 'Slovaquie',
    'SI': 'Slovénie',
    'SO': 'Somalie',
    'SD': 'Soudan',
    'SS': 'Soudan du Sud',
    'LK': 'Sri Lanka',
    'SE': 'Suède',
    'CH': 'Suisse',
    'SR': 'Suriname',
    'SZ': 'Eswatini',
    'SY': 'Syrie',
    'TJ': 'Tadjikistan',
    'TZ': 'Tanzanie',
    'TD': 'Tchad',
    'CZ': 'Tchéquie',
    'TH': 'Thaïlande',
    'TL': 'Timor oriental',
    'TG': 'Togo',
    'TO': 'Tonga',
    'TT': 'Trinité-et-Tobago',
    'TN': 'Tunisie',
    'TM': 'Turkménistan',
    'TR': 'Turquie',
    'TV': 'Tuvalu',
    'UA': 'Ukraine',
    'UY': 'Uruguay',
    'VU': 'Vanuatu',
    'VA': 'Vatican',
    'VE': 'Venezuela',
    'VN': 'Viêt Nam',
    'YE': 'Yémen',
    'ZM': 'Zambie',
    'ZW': 'Zimbabwe'
  }
  return countries[countryCode] || countryCode || 'Non défini'
}

const getCivilityLabel = (civility: string): string => {
  const civilities: Record<string, string> = {
    'Mr': 'Monsieur',
    'Mme': 'Madame',
    'Mlle': 'Mademoiselle'
  }
  return civilities[civility] || civility || 'Non défini'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.user-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.user-header-overlay {
  position: relative;
  min-height: 300px;
  background: linear-gradient(135deg, #585859 0%, #c2b7b7 100%);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.user-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.user-header-overlay::before {
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

.user-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.user-content {
  line-height: 1.7;
}

.user-content h1,
.user-content h2,
.user-content h3 {
  color: rgb(var(--v-theme-primary));
  margin: 1.5rem 0 1rem 0;
}

.user-content ul,
.user-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.user-content li {
  margin: 0.5rem 0;
}

.user-content p {
  margin: 1rem 0;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-company {
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
}

.animate-tag {
  transition: all 0.3s ease;
}

.animate-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.animate-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
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
@media (max-width: 960px) {
  .user-header-card {
    min-height: 250px;
  }

  .user-header-overlay {
    min-height: 250px;
    padding: 1.5rem;
  }

  .user-header-content {
    padding: 1.5rem;
  }

  .animate-title {
    font-size: 1.75rem !important;
  }
}

@media (max-width: 600px) {
  .user-header-overlay {
    min-height: 200px;
  }

  .user-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
    margin-bottom: 1rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }

  .action-btn {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .user-header-overlay {
    min-height: 180px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-company {
    flex-direction: column;
    align-items: flex-start;
  }

  .animate-company .v-avatar {
    margin-bottom: 0.5rem;
  }
}
</style>
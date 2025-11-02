<template>
  <VContainer class="student-applications-page">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          <VIcon icon="ri-file-list-line" class="me-3" color="primary" />
          Mes candidatures
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez vos candidatures aux formations
        </p>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <VCard class="mb-6" elevation="1">
      <VCardText class="py-4">
        <VRow>
          <VCol cols="12" md="4">
            <VTextField v-model="searchQuery" label="Rechercher" variant="outlined" density="comfortable"
              prepend-inner-icon="ri-search-line" placeholder="Numéro, formation, email..." clearable
              @input="handleSearch" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.status" :items="statusOptions" label="Statut" variant="outlined"
              density="comfortable" clearable @update:model-value="handleFilterChange" />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect v-model="filters.is_paid" :items="paymentOptions" label="Paiement" variant="outlined"
              density="comfortable" clearable @update:model-value="handleFilterChange">
              <template #prepend-inner>
                <VIcon v-if="filters.is_paid === undefined" color="success" size="small">ri-check-line</VIcon>
              </template>
            </VSelect>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn variant="outlined" color="primary" @click="() => resetFilters(true)" :disabled="!hasActiveFilters" block>
              <VIcon class="mr-2">ri-refresh-line</VIcon>
              Réinitialiser
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Statistiques -->
    <VRow class="mb-0">
      <VCol cols="12" sm="6" md="3">
        <VCard class="session-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-group-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ totalApplicationsCount.toLocaleString() }}</div>
              <div>Total</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="active-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-heart-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ getStatusCount('SUBMITTED').toLocaleString() }}</div>
              <div>Soumises</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="paid-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-follow-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ getStatusCount('APPROVED').toLocaleString() }}</div>
              <div>Approuvées</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="pending-users-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-user-unfollow-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ getStatusCount('REFUSED').toLocaleString() }}</div>
              <div>Refusées</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VRow>
      <VCol v-for="application in filteredApplications" :key="application.id" cols="12" md="6" lg="4">
        <StudentApplicationCard :application="application" @view="handleView" @delete="handleDelete" />
      </VCol>
    </VRow>

    <!-- Bouton charger plus -->
    <div v-if="canLoadMore && !isLoading && hasApplications" class="text-center pa-4">
      <VBtn variant="outlined" color="primary" :loading="isLoading" @click="loadMoreApplications">
        <VIcon class="mr-2">ri-arrow-down-line</VIcon>
        Charger plus
      </VBtn>
    </div>

    <!-- État vide -->
    <VCard v-if="!isLoading && !hasApplications" elevation="1">
      <VCardText class="text-center py-12">
        <VIcon size="64" color="grey-lighten-1" class="mb-4">ri-file-list-line</VIcon>
        <h3 class="text-h6 mb-2">Aucune candidature</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Vous n'avez pas encore de candidatures aux formations. Créez votre première candidature pour commencer.
        </p>
      </VCardText>
    </VCard>

    <!-- Chargement -->
    <VCard v-if="isLoading" elevation="1">
      <VCardText class="text-center py-12">
        <VProgressCircular indeterminate color="primary" size="64" class="mb-4" />
        <p class="text-body-1">Chargement des candidatures...</p>
      </VCardText>
    </VCard>

    <!-- Erreur -->
    <VAlert v-if="error" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>

    <!-- Modal de paiement rapide -->
    <VDialog v-model="showPaymentModal" max-width="600" persistent>
      <VCard>
        <VCardTitle class="d-flex align-center">
          <VIcon color="success" class="mr-2">ri-bank-card-line</VIcon>
          <span class="text-h6">Paiement des frais de formation</span>
        </VCardTitle>
        <VDivider />
        <VCardText class="py-4">
          <div v-if="selectedApplication">
            <!-- Détails de la candidature -->
            <VRow class="mb-4">
              <VCol cols="12">
                <div class="d-flex align-center mb-3">
                  <VIcon color="primary" class="mr-2">ri-hashtag</VIcon>
                  <div>
                    <div class="text-caption text-medium-emphasis">Numéro de candidature</div>
                    <div class="text-body-1 font-weight-medium">{{ selectedApplication.application_number }}</div>
                  </div>
                </div>
              </VCol>
              <VCol cols="12">
                <div class="d-flex align-center mb-3">
                  <VIcon color="primary" class="mr-2">ri-graduation-cap-line</VIcon>
                  <div>
                    <div class="text-caption text-medium-emphasis">Formation</div>
                    <div class="text-body-1 font-weight-medium">{{ selectedApplication.training_title || 'Formation non spécifiée' }}</div>
                  </div>
                </div>
              </VCol>
            </VRow>

            <!-- Détails des frais -->
            <VCard variant="tonal" color="success" class="mb-4">
              <VCardText>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1">Frais d'inscription</span>
                  <span class="text-h6 font-weight-bold text-success">
                    {{ formatCurrency(selectedApplication.registration_fee) }}
                  </span>
                </div>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-body-1">Frais de formation</span>
                  <span class="text-h6 font-weight-bold text-success">
                    {{ formatCurrency(selectedApplication.training_fee) }}
                  </span>
                </div>
                <VDivider class="my-2" />
                <div class="d-flex justify-space-between align-center">
                  <span class="text-h6 font-weight-bold">Total à payer</span>
                  <span class="text-h4 font-weight-bold text-success">
                    {{ formatCurrency(totalPaymentAmount) }}
                  </span>
                </div>
              </VCardText>
            </VCard>

            <!-- Formulaire de paiement -->
            <VForm ref="paymentFormRef" @submit.prevent="handleQuickPayment">
              <VAlert type="info" variant="tonal" class="mb-4">
                <template #prepend>
                  <VIcon icon="ri-information-line" />
                </template>
                <div>
                  <strong>Mode de paiement</strong>
                  <p class="mb-0">Vous serez redirigé vers une plateforme de paiement sécurisée.</p>
                </div>
              </VAlert>
              <VCheckbox v-model="acceptPaymentTerms"
                label="J'accepte les conditions de paiement et la politique de confidentialité"
                :rules="[(v: boolean) => !!v || 'Vous devez accepter les conditions']" required />
            </VForm>
          </div>
        </VCardText>
        <VCardActions class="px-6 pb-4">
          <VSpacer />
          <VBtn variant="outlined" @click="closePaymentModal">
            Annuler
          </VBtn>
          <VBtn color="success" :loading="isProcessingPayment" :disabled="isProcessingPayment || !acceptPaymentTerms"
            @click="handleQuickPayment" prepend-icon="ri-bank-card-line">
            Payer {{ formatCurrency(totalPaymentAmount) }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Les formulaires sont maintenant dans des pages séparées -->
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStudentApplication } from '@/composables/useStudentApplication';
import StudentApplicationCard from '@/components/student-application/StudentApplicationCard.vue';
import type { StudentApplicationOut } from '@/types/student-application';
import { ApplicationStatusEnum } from '@/types/student-application';
import { showToast } from '@/components/toast/toastManager';
import { confirmAction } from '@/utils/confirm';
import { VForm } from 'vuetify/components';

const router = useRouter();

// Composable
const {
  applications,
  isLoading,
  isSubmitting,
  error,
  totalCount,
  searchQuery,
  filters,
  hasApplications,
  canLoadMore,
  filteredApplications,
  loadApplications,
  loadMoreApplications,
  searchApplications,
  applyFilters,
  resetFilters,
  deleteApplication,
  submitApplication,
  payTrainingFee,
  reset,
  getStatusChip,
  canDeleteApplication,
  canSubmitApplication,
} = useStudentApplication();

// Local state pour le modal de paiement
const showPaymentModal = ref(false);
const selectedApplication = ref<any>(null);
const isProcessingPayment = ref(false);
const acceptPaymentTerms = ref(false);
const paymentFormRef = ref();

// Options
const statusOptions = [
  { title: 'Reçue', value: ApplicationStatusEnum.RECEIVED },
  { title: 'Soumise', value: ApplicationStatusEnum.SUBMITTED },
  { title: 'Approuvée', value: ApplicationStatusEnum.APPROVED },
  { title: 'Refusée', value: ApplicationStatusEnum.REFUSED },
];

const paymentOptions = [
  { title: 'Payée', value: true },
  { title: 'Non payée', value: false },
];

// Computed
const hasActiveFilters = computed(() => {
  return !!(
    searchQuery.value ||
    filters.value.status
    //  ||
    // filters.value.is_paid !== undefined
  );
});

const totalPaymentAmount = computed(() => {
  if (!selectedApplication.value) return 0;
  const registrationFee = selectedApplication.value.registration_fee || 0;
  const trainingFee = selectedApplication.value.training_fee || 0;
  return registrationFee + trainingFee;
});

// Statistiques basées sur toutes les candidatures
const totalApplicationsCount = computed(() => {
  return applications.value.length;
});

const paidApplicationsCount = computed(() => {
  return applications.value.filter(app => !!app.payment_id).length;
});

const unpaidApplicationsCount = computed(() => {
  return applications.value.filter(app => !app.payment_id).length;
});

// Methods
const handleSearch = async (query: string) => {
  await searchApplications(query, true); // true = utiliser l'endpoint admin
};

const handleFilterChange = async () => {
  await applyFilters(filters.value, true); // true = utiliser l'endpoint admin
};

const handleView = (id: number) => {
  router.push({ name: 'student-applications-detail', params: { id: id.toString() } });
};

const handleDelete = async (id: number) => {
  const application = applications.value.find(app => app.id === id);
  if (!application) return;

  const confirmed = await confirmAction({
    title: 'Supprimer la candidature',
    html: `Êtes-vous sûr de vouloir supprimer la candidature <b>${application.application_number}</b> ?`,
    confirmButtonText: '<span style="color:white">Supprimer</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  });

  if (!confirmed) return;

  try {
    await deleteApplication(id);
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
  }
};

const handleSubmit = async (id: number) => {
  const application = applications.value.find(app => app.id === id);
  if (!application) return;

  const confirmed = await confirmAction({
    title: 'Soumettre la candidature',
    html: `Êtes-vous sûr de vouloir soumettre la candidature <b>${application.application_number}</b> ?`,
    confirmButtonText: '<span style="color:white">Soumettre</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  });

  if (!confirmed) return;

  try {
    await submitApplication(id, application.target_session_id, true); // true = utiliser l'endpoint admin
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
  }
};

const handlePay = (id: number) => {
  const application = applications.value.find(app => app.id === id);
  if (application) {
    selectedApplication.value = application;
    showPaymentModal.value = true;
    acceptPaymentTerms.value = false;
  }
};

const clearError = () => {
  reset();
};

const closePaymentModal = () => {
  showPaymentModal.value = false;
  selectedApplication.value = null;
  acceptPaymentTerms.value = false;
};

const handleQuickPayment = async () => {
  if (!selectedApplication.value) return;

  const { valid } = await paymentFormRef.value!.validate();
  if (!valid) return;

  const confirmed = await confirmAction({
    title: 'Confirmer le paiement',
    html: `Voulez-vous procéder au paiement de <b>${formatCurrency(totalPaymentAmount.value)}</b> pour la candidature <b>${selectedApplication.value.application_number}</b> ?`,
    confirmButtonText: `<span style="color:white">Payer</span>`,
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#6c757d',
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  });

  if (!confirmed) return;

  try {
    isProcessingPayment.value = true;

    const paymentData = {
      training_session_id: selectedApplication.value.target_session_id,
      amount: totalPaymentAmount.value,
    };

    console.log('💳 Paiement rapide:', paymentData);
    const response = await payTrainingFee(paymentData);

    if (response.data.payment_link) {
      window.location.href = response.data.payment_link;
    } else {
      showToast({
        message: 'Redirection vers la plateforme de paiement...',
        type: 'info',
      });
    }
  } catch (err: any) {
    console.error('Erreur lors du paiement rapide:', err);
    showToast({
      message: "Erreur lors de l'initialisation du paiement",
      type: 'error',
    });
  } finally {
    isProcessingPayment.value = false;
  }
};

const formatCurrency = (amount: number | undefined) => {
  if (!amount) return '0,00 €';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const getStatusCount = (status: string) => {
  return applications.value.filter(app => app.status === status).length;
};

// Lifecycle
onMounted(async () => {
  await loadApplications(true);
  console.log('Applications:', applications.value);
  console.log('Filtered Applications:', filteredApplications.value);
});
</script>


<style scoped>
.student-applications-page {
  max-width: 1200px;
}

/* Styles pour les cartes de statistiques */
.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  transition: all 0.3s ease;
}

.stats-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.total-applications-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submitted-applications-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.approved-applications-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.refused-applications-card .stats-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

/* Hover effects */
.total-applications-card:hover .stats-icon,
.submitted-applications-card:hover .stats-icon,
.approved-applications-card:hover .stats-icon,
.refused-applications-card:hover .stats-icon {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Responsive design */
@media (max-width: 768px) {
  .stats-icon {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }

  .stats-value {
    font-size: 1.5rem;
  }
}
</style>

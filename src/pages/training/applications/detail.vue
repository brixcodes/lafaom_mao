<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePermissionStore } from '@/stores/permission'
import { trainingService } from '@/services/api/training'
import type { StudentApplication } from '@/types/training'
import { useSnackbar } from '@/composables/snackbar'
import { downloadAttachment, getDocumentTypeLabel, getFileIcon } from '@/utils/files'

const router = useRouter()
const route = useRoute()
const { showError } = useSnackbar()

// Permissions
const permissionStore = usePermissionStore()
const { hasPermission } = storeToRefs(permissionStore)

const hasUpdatePermission = computed(() => hasPermission.value('CAN_UPDATE_STUDENT_APPLICATION'))

// État
const application = ref<StudentApplication | null>(null)
const isLoading = ref(true)

// Fonctions
const fetchApplication = async () => {
  try {
    const id = Number.parseInt(route.params.id as string)
    const response = await trainingService.getStudentApplication(id)

    application.value = response.data
  }
  catch (error) {
    showError('Erreur lors du chargement de la candidature')
    router.push({ name: 'training-applications-index' })
  }
  finally {
    isLoading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// Initialisation
onMounted(() => {
  fetchApplication()
})
</script>

<template>
  <div class="training-applications-detail-page">
    <VCard>
      <VCardTitle class="d-flex justify-space-between align-center pa-4">
        <div>
          <h1 class="text-h5">
            Détail de la candidature
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Informations complètes sur la candidature
          </p>
        </div>

        <div class="d-flex gap-4">
          <VBtn v-if="hasUpdatePermission" color="primary" prepend-icon="ri-edit-line"
            :to="{ name: 'training-applications-edit', params: { id: application?.id } }">
            Modifier
          </VBtn>

          <VBtn color="grey" variant="text" :to="{ name: 'training-applications-index' }">
            Retour
          </VBtn>
        </div>
      </VCardTitle>

      <VCardText>
        <VProgressCircular v-if="isLoading" indeterminate class="ma-3" />

        <template v-else-if="application">
          <VRow>
            <VCol cols="12" md="6">
              <h2 class="text-h6 mb-4">
                Informations de la candidature
              </h2>

              <div class="d-flex flex-column gap-4">
                <div>
                  <p class="font-weight-bold mb-1">
                    N° de candidature
                  </p>
                  <p class="mb-0">
                    {{ application.application_number }}
                  </p>
                </div>

                <div v-if="application.training">
                  <p class="font-weight-bold mb-1">
                    Formation
                  </p>
                  <p class="mb-0">
                    {{ application.training.title }}
                  </p>
                </div>

                <div>
                  <p class="font-weight-bold mb-1">
                    Date de candidature
                  </p>
                  <p class="mb-0">
                    {{ formatDate(application.created_at) }}
                  </p>
                </div>

                <div>
                  <p class="font-weight-bold mb-1">
                    Statut
                  </p>
                  <VChip
                    :color="application.status === 'APPROVED' ? 'success' : (application.status === 'REFUSED' ? 'error' : 'warning')"
                    size="small">
                    {{ application.status }}
                  </VChip>
                </div>

                <div v-if="application.refusal_reason">
                  <p class="font-weight-bold mb-1">
                    Motif de refus
                  </p>
                  <p class="mb-0 white-space-pre-wrap">
                    {{ application.refusal_reason }}
                  </p>
                </div>
              </div>
            </VCol>

            <VCol cols="12" md="6">
              <h2 class="text-h6 mb-4">
                Frais et paiements
              </h2>

              <div class="d-flex flex-column gap-4">
                <div>
                  <p class="font-weight-bold mb-1">
                    Frais d'inscription
                  </p>
                  <p class="mb-0">
                    {{ application.registration_fee }} €
                  </p>
                </div>

                <div>
                  <p class="font-weight-bold mb-1">
                    Frais de formation
                  </p>
                  <p class="mb-0">
                    {{ application.training_fee }} €
                  </p>
                </div>

                <div v-if="application.installment_percentage?.length">
                  <p class="font-weight-bold mb-1">
                    Pourcentage des échéances
                  </p>
                  <VChip v-for="(percentage, index) in application.installment_percentage" :key="index" class="me-2"
                    size="small">
                    {{ percentage }}%
                  </VChip>
                </div>

                <div v-if="application.attachments?.length">
                  <p class="font-weight-bold mb-1">
                    Documents
                  </p>
                  <VList>
                    <VListItem v-for="attachment in application.attachments" :key="attachment.id"
                      :prepend-icon="getFileIcon(attachment.document_type)"
                      :title="getDocumentTypeLabel(attachment.document_type)"
                      :subtitle="formatDate(attachment.created_at)" density="compact"
                      @click="downloadAttachment(attachment.file_path)">
                      <template #append>
                        <VBtn icon="ri-download-line" size="small" variant="text" />
                      </template>
                    </VListItem>
                  </VList>
                </div>
              </div>
            </VCol>
          </VRow>
        </template>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
.training-applications-detail-page {
  padding: 2rem;
}

.white-space-pre-wrap {
  white-space: pre-wrap;
}
</style>

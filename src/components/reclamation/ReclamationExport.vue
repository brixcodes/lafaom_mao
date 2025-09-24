<template>
  <VCard>
    <VCardTitle>
      <div class="d-flex align-center">
        <VIcon class="mr-3" color="primary">ri-download-line</VIcon>
        Exporter les réclamations
      </div>
    </VCardTitle>
    
    <VCardText>
      <VForm ref="formRef" v-model="isFormValid" @submit.prevent="handleExport">
        <VRow>
          <VCol cols="12" md="6">
            <VSelect
              v-model="exportFormat"
              label="Format d'export"
              :items="formatOptions"
              variant="outlined"
              required
            />
          </VCol>
          
          <VCol cols="12" md="6">
            <VSelect
              v-model="dateRange"
              label="Période"
              :items="dateRangeOptions"
              variant="outlined"
            />
          </VCol>
          
          <VCol cols="12">
            <VCheckbox
              v-model="includeDetails"
              label="Inclure les détails complets"
            />
          </VCol>
          
          <VCol cols="12">
            <VCheckbox
              v-model="includeAttachments"
              label="Inclure les pièces jointes"
            />
          </VCol>
        </VRow>
        
        <VDivider class="my-6" />
        
        <div class="d-flex justify-end gap-3">
          <VBtn
            variant="outlined"
            @click="$emit('cancel')"
            :disabled="isExporting"
          >
            Annuler
          </VBtn>
          <VBtn
            type="submit"
            color="primary"
            :loading="isExporting"
            :disabled="!isFormValid"
          >
            <VIcon class="mr-2">ri-download-line</VIcon>
            {{ isExporting ? 'Export en cours...' : 'Exporter' }}
          </VBtn>
        </div>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isExporting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isExporting: false
})

const emit = defineEmits<{
  export: [data: ExportData]
  cancel: []
}>()

// State
const formRef = ref()
const isFormValid = ref(false)
const exportFormat = ref('excel')
const dateRange = ref('all')
const includeDetails = ref(true)
const includeAttachments = ref(false)

// Options
const formatOptions = [
  { title: 'Excel (.xlsx)', value: 'excel' },
  { title: 'CSV (.csv)', value: 'csv' },
  { title: 'PDF (.pdf)', value: 'pdf' }
]

const dateRangeOptions = [
  { title: 'Toutes les réclamations', value: 'all' },
  { title: 'Dernière semaine', value: 'week' },
  { title: 'Dernier mois', value: 'month' },
  { title: 'Dernière année', value: 'year' }
]

// Methods
const handleExport = () => {
  const exportData: ExportData = {
    format: exportFormat.value,
    dateRange: dateRange.value,
    includeDetails: includeDetails.value,
    includeAttachments: includeAttachments.value
  }
  
  emit('export', exportData)
}

interface ExportData {
  format: string
  dateRange: string
  includeDetails: boolean
  includeAttachments: boolean
}
</script>

<style scoped>
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

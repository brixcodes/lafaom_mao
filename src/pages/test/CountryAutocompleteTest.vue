<template>
  <div class="pa-6">
    <h1 class="text-h4 mb-6">Test du composant CountryAutocomplete</h1>
    
    <VRow>
      <!-- Test basique -->
      <VCol cols="12" md="6">
        <VCard elevation="2" class="pa-4">
          <VCardTitle>Test basique</VCardTitle>
          <VCardText>
            <CountryAutocomplete
              v-model="selectedCountry1"
              @change="onCountryChange1"
            />
            
            <div v-if="selectedCountry1" class="mt-4 pa-3 bg-success-lighten-5 rounded">
              <h4 class="text-subtitle-1">Pays sélectionné :</h4>
              <div><strong>Nom :</strong> {{ selectedCountry1.name }}</div>
              <div><strong>Code ISO :</strong> {{ selectedCountry1.code }}</div>
              <div><strong>Code ISO3 :</strong> {{ selectedCountry1.code3 }}</div>
              <div><strong>Région :</strong> {{ selectedCountry1.region }}</div>
              <div><strong>Flag :</strong> {{ selectedCountry1.flag }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Test avec pays African uniquement -->
      <VCol cols="12" md="6">
        <VCard elevation="2" class="pa-4">
          <VCardTitle>Test - Pays africains seulement</VCardTitle>
          <VCardText>
            <CountryAutocomplete
              v-model="selectedCountry2"
              :regions="['Africa']"
              label="Pays africain"
              placeholder="Choisir un pays d'Afrique..."
              @change="onCountryChange2"
            />
            
            <div v-if="selectedCountry2" class="mt-4 pa-3 bg-info-lighten-5 rounded">
              <h4 class="text-subtitle-1">Pays africain sélectionné :</h4>
              <div><strong>Nom :</strong> {{ selectedCountry2.name }}</div>
              <div><strong>Code ISO :</strong> {{ selectedCountry2.code }}</div>
              <div><strong>Région :</strong> {{ selectedCountry2.region }}</div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Test avec valeur initiale -->
      <VCol cols="12" md="6">
        <VCard elevation="2" class="pa-4">
          <VCardTitle>Test avec valeur initiale (Cameroun)</VCardTitle>
          <VCardText>
            <CountryAutocomplete
              v-model="selectedCountry3"
              label="Pays avec valeur par défaut"
              @change="onCountryChange3"
            />
            
            <div v-if="selectedCountry3" class="mt-4 pa-3 bg-warning-lighten-5 rounded">
              <h4 class="text-subtitle-1">Pays avec défaut :</h4>
              <div><strong>Nom :</strong> {{ selectedCountry3.name }}</div>
              <div><strong>Code ISO :</strong> {{ selectedCountry3.code }}</div>
            </div>
            
            <VBtn @click="resetToCameroon" color="primary" variant="outlined" class="mt-2">
              Remettre Cameroun
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Logs des changements -->
      <VCol cols="12" md="6">
        <VCard elevation="2" class="pa-4">
          <VCardTitle>Journal des changements</VCardTitle>
          <VCardText>
            <div class="logs-container" style="max-height: 300px; overflow-y: auto; font-family: monospace; font-size: 12px;">
              <div v-for="(log, index) in logs" :key="index" class="log-entry mb-1">
                <span class="text-caption text-medium-emphasis">{{ log.timestamp }}</span>
                <br>
                <span :class="log.type === 'change' ? 'text-success' : 'text-info'">
                  {{ log.message }}
                </span>
              </div>
            </div>
            <VBtn @click="clearLogs" size="small" variant="outlined" class="mt-2">
              Vider les logs
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CountryAutocomplete, { type Country } from '@/components/common/CountryAutocomplete.vue'

// États
const selectedCountry1 = ref<Country | null>(null)
const selectedCountry2 = ref<Country | null>(null)
const selectedCountry3 = ref<Country | null>(null)

interface LogEntry {
  timestamp: string
  type: 'change' | 'info'
  message: string
}

const logs = ref<LogEntry[]>([])

// Méthodes de gestion des changements
const onCountryChange1 = (country: Country | null) => {
  addLog('change', `Test basique - Pays changé: ${country?.name || 'Aucun'} (${country?.code || 'N/A'})`)
}

const onCountryChange2 = (country: Country | null) => {
  addLog('change', `Test africain - Pays changé: ${country?.name || 'Aucun'} (${country?.code || 'N/A'})`)
}

const onCountryChange3 = (country: Country | null) => {
  addLog('change', `Test défaut - Pays changé: ${country?.name || 'Aucun'} (${country?.code || 'N/A'})`)
}

// Utilitaires
const addLog = (type: 'change' | 'info', message: string) => {
  const timestamp = new Date().toLocaleTimeString('fr-FR')
  logs.value.push({ timestamp, type, message })
}

const clearLogs = () => {
  logs.value = []
  addLog('info', 'Logs vidés')
}

const resetToCameroon = () => {
  // Simuler la sélection du Cameroun par code
  selectedCountry3.value = {
    name: 'Cameroon',
    code: 'CM',
    code3: 'CMR',
    flag: '🇨🇲',
    region: 'Africa',
    subregion: 'Central Africa'
  }
  addLog('info', 'Cameroun défini manuellement')
}

// Initialisation
onMounted(() => {
  addLog('info', 'Composant de test monté')
  
  // Initialiser avec le Cameroun pour le test 3
  setTimeout(() => {
    resetToCameroon()
  }, 500)
})
</script>

<style scoped>
.log-entry {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 8px;
  margin-bottom: 4px;
}
</style>
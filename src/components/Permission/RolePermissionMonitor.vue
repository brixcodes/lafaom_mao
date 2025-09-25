<template>
  <VCard v-if="isDevelopment" class="mt-4 d-none">
    <VCardTitle class="d-flex align-center">
      <VIcon icon="ri-dashboard-line" class="me-2" />
      Monitoring des Rôles et Permissions
    </VCardTitle>
    
    <VCardText>
      <!-- Statistiques générales -->
      <VRow>
        <VCol cols="12" md="3">
          <VCard variant="outlined" color="primary">
            <VCardText class="text-center">
              <VIcon icon="ri-user-line" size="24" class="mb-2" />
              <div class="text-h6">{{ stats.totalUsers }}</div>
              <div class="text-caption">Utilisateurs</div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="3">
          <VCard variant="outlined" color="success">
            <VCardText class="text-center">
              <VIcon icon="ri-shield-user-line" size="24" class="mb-2" />
              <div class="text-h6">{{ stats.totalRoles }}</div>
              <div class="text-caption">Rôles</div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="3">
          <VCard variant="outlined" color="info">
            <VCardText class="text-center">
              <VIcon icon="ri-key-line" size="24" class="mb-2" />
              <div class="text-h6">{{ stats.totalPermissions }}</div>
              <div class="text-caption">Permissions</div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="3">
          <VCard variant="outlined" color="warning">
            <VCardText class="text-center">
              <VIcon icon="ri-time-line" size="24" class="mb-2" />
              <div class="text-h6">{{ stats.avgResponseTime }}ms</div>
              <div class="text-caption">Temps moyen</div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Graphique des performances -->
      <VRow class="mt-4">
        <VCol cols="12" md="6">
          <VCard variant="outlined">
            <VCardTitle>Performance des API</VCardTitle>
            <VCardText>
              <div class="d-flex justify-space-between mb-2">
                <span>Chargement des rôles</span>
                <VChip :color="getPerformanceColor(stats.rolesLoadTime)" size="small">
                  {{ stats.rolesLoadTime }}ms
                </VChip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Chargement des permissions</span>
                <VChip :color="getPerformanceColor(stats.permissionsLoadTime)" size="small">
                  {{ stats.permissionsLoadTime }}ms
                </VChip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Chargement permissions utilisateur</span>
                <VChip :color="getPerformanceColor(stats.userPermissionsLoadTime)" size="small">
                  {{ stats.userPermissionsLoadTime }}ms
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        
        <VCol cols="12" md="6">
          <VCard variant="outlined">
            <VCardTitle>État du Cache</VCardTitle>
            <VCardText>
              <div class="d-flex justify-space-between mb-2">
                <span>Cache des rôles</span>
                <VChip :color="cacheStats.rolesCacheSize > 0 ? 'success' : 'default'" size="small">
                  {{ cacheStats.rolesCacheSize }} éléments
                </VChip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Cache des permissions</span>
                <VChip :color="cacheStats.permissionsCacheSize > 0 ? 'success' : 'default'" size="small">
                  {{ cacheStats.permissionsCacheSize }} éléments
                </VChip>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span>Cache utilisateurs</span>
                <VChip :color="cacheStats.userPermissionsCacheSize > 0 ? 'success' : 'default'" size="small">
                  {{ cacheStats.userPermissionsCacheSize }} éléments
                </VChip>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Actions de monitoring -->
      <VRow class="mt-4">
        <VCol cols="12">
          <VCard variant="outlined">
            <VCardTitle>Actions de Monitoring</VCardTitle>
            <VCardText>
              <div class="d-flex gap-3 flex-wrap">
                <VBtn
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="refreshStats"
                  :loading="isLoading"
                >
                  <VIcon icon="ri-refresh-line" class="me-1" />
                  Actualiser
                </VBtn>
                
                <VBtn
                  color="warning"
                  variant="outlined"
                  size="small"
                  @click="clearCache"
                >
                  <VIcon icon="ri-delete-bin-line" class="me-1" />
                  Vider le cache
                </VBtn>
                
                <VBtn
                  color="info"
                  variant="outlined"
                  size="small"
                  @click="exportStats"
                >
                  <VIcon icon="ri-download-line" class="me-1" />
                  Exporter les stats
                </VBtn>
                
                <VBtn
                  color="success"
                  variant="outlined"
                  size="small"
                  @click="toggleAutoRefresh"
                >
                  <VIcon :icon="autoRefresh ? 'ri-pause-line' : 'ri-play-line'" class="me-1" />
                  {{ autoRefresh ? 'Pause' : 'Auto-refresh' }}
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Logs en temps réel -->
      <VRow class="mt-4">
        <VCol cols="12">
          <VCard variant="outlined">
            <VCardTitle class="d-flex align-center justify-space-between">
              <span>Logs en temps réel</span>
              <VBtn
                size="small"
                variant="text"
                @click="clearLogs"
              >
                <VIcon icon="ri-delete-bin-line" />
              </VBtn>
            </VCardTitle>
            <VCardText>
              <div class="logs-container">
                <div
                  v-for="(log, index) in logs"
                  :key="index"
                  class="log-entry"
                  :class="getLogClass(log.type)"
                >
                  <span class="log-time">{{ formatTime(log.timestamp) }}</span>
                  <span class="log-type">{{ log.type }}</span>
                  <span class="log-message">{{ log.message }}</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRolePermissionOptimization } from '@/composables/useRolePermissionOptimization'

interface LogEntry {
  timestamp: number
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
}

interface Stats {
  totalUsers: number
  totalRoles: number
  totalPermissions: number
  avgResponseTime: number
  rolesLoadTime: number
  permissionsLoadTime: number
  userPermissionsLoadTime: number
}

// Props
interface Props {
  stats: Stats
  isLoading?: boolean
}

const props = defineProps<Props>()

// Local state
const logs = ref<LogEntry[]>([])
const autoRefresh = ref(false)
const refreshInterval = ref<NodeJS.Timeout | null>(null)

// Composables
const { cacheStats, invalidateCache } = useRolePermissionOptimization()

// Computed
const isDevelopment = computed(() => import.meta.env.DEV)

// Methods
const getPerformanceColor = (time: number): string => {
  if (time < 200) return 'success'
  if (time < 500) return 'warning'
  return 'error'
}

const getLogClass = (type: string): string => {
  const classes = {
    info: 'log-info',
    success: 'log-success',
    warning: 'log-warning',
    error: 'log-error'
  }
  return classes[type as keyof typeof classes] || 'log-info'
}

const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString()
}

const addLog = (type: LogEntry['type'], message: string) => {
  logs.value.unshift({
    timestamp: Date.now(),
    type,
    message
  })
  
  // Limiter à 100 logs
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100)
  }
}

const refreshStats = () => {
  addLog('info', 'Actualisation des statistiques...')
  // Émettre un événement pour actualiser les stats
  window.dispatchEvent(new CustomEvent('refresh-role-permission-stats'))
}

const clearCache = () => {
  invalidateCache()
  addLog('warning', 'Cache vidé')
}

const exportStats = () => {
  const data = {
    stats: props.stats,
    cacheStats: cacheStats.value,
    logs: logs.value,
    timestamp: Date.now()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `role-permission-stats-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  addLog('success', 'Statistiques exportées')
}

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value
  
  if (autoRefresh.value) {
    refreshInterval.value = setInterval(() => {
      refreshStats()
    }, 5000)
    addLog('info', 'Auto-refresh activé (5s)')
  } else {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
    addLog('info', 'Auto-refresh désactivé')
  }
}

const clearLogs = () => {
  logs.value = []
  addLog('info', 'Logs effacés')
}

// Lifecycle
onMounted(() => {
  addLog('info', 'Monitoring des rôles et permissions démarré')
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>

<style scoped>
.logs-container {
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
}

.log-entry {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin-bottom: 2px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
}

.log-time {
  color: #666;
  margin-right: 8px;
  min-width: 80px;
}

.log-type {
  margin-right: 8px;
  min-width: 60px;
  font-weight: bold;
}

.log-message {
  flex: 1;
}

.log-info {
  background-color: #e3f2fd;
  color: #1976d2;
}

.log-success {
  background-color: #e8f5e8;
  color: #2e7d32;
}

.log-warning {
  background-color: #fff3e0;
  color: #f57c00;
}

.log-error {
  background-color: #ffebee;
  color: #d32f2f;
}
</style>

<template class="d-none">
  <VCard class="pa-4 d-none">
    <VCardTitle>🐛 Testeur de Permissions/Rôles</VCardTitle>
    
    <VCardText>
      <VRow>
        <VCol cols="12" md="6">
          <VTextField
            v-model="testUserId"
            label="ID Utilisateur à tester"
            variant="outlined"
            placeholder="Entrez l'ID utilisateur"
          />
        </VCol>
        <VCol cols="12" md="6">
          <div class="d-flex gap-2">
            <VBtn @click="loadPermissions" :loading="loading" color="primary">
              Charger Permissions
            </VBtn>
            <VBtn @click="testRevokePermission" :loading="loading" color="warning">
              Test Révocation
            </VBtn>
            <VBtn @click="testRevokeRole" :loading="loading" color="error">
              Test Révocation Rôle
            </VBtn>
          </div>
        </VCol>
      </VRow>
      
      <VDivider class="my-4" />
      
      <!-- Résultats du test -->
      <div v-if="testResults.length > 0">
        <h3>📊 Résultats des tests :</h3>
        <VList>
          <VListItem
            v-for="(result, index) in testResults"
            :key="index"
            :class="result.success ? 'text-success' : 'text-error'"
          >
            <VListItemTitle>{{ result.action }}</VListItemTitle>
            <VListItemSubtitle>{{ result.message }}</VListItemSubtitle>
            <template #append>
              <VIcon :icon="result.success ? 'ri-check-line' : 'ri-close-line'" />
            </template>
          </VListItem>
        </VList>
      </div>
      
      <!-- Détails des permissions -->
      <div v-if="currentPermissions.length > 0" class="mt-4">
        <h3>🔑 Permissions actuelles ({{ currentPermissions.length }}) :</h3>
        <VChipGroup>
          <VChip
            v-for="permission in currentPermissions.slice(0, 10)"
            :key="permission.permission"
            size="small"
            :color="permission.role_id ? 'primary' : 'secondary'"
          >
            {{ permission.permission }}
            <VTooltip activator="parent">
              {{ permission.role_id ? `Via rôle ID: ${permission.role_id}` : 'Permission directe' }}
            </VTooltip>
          </VChip>
          <VChip v-if="currentPermissions.length > 10" color="grey">
            +{{ currentPermissions.length - 10 }} autres...
          </VChip>
        </VChipGroup>
      </div>
      
      <!-- Comparaison avant/après -->
      <div v-if="comparisonData" class="mt-4">
        <h3>🔄 Comparaison Avant/Après :</h3>
        <VRow>
          <VCol cols="6">
            <h4 class="text-error">🔴 Avant ({{ comparisonData.before.length }}) :</h4>
            <div class="comparison-box">
              <VChip
                v-for="perm in comparisonData.before.slice(0, 5)"
                :key="`before-${perm.permission}`"
                size="small"
                color="error"
                variant="tonal"
                class="ma-1"
              >
                {{ perm.permission }}
              </VChip>
              <div v-if="comparisonData.before.length > 5" class="text-caption text-medium-emphasis">
                +{{ comparisonData.before.length - 5 }} autres...
              </div>
            </div>
          </VCol>
          <VCol cols="6">
            <h4 class="text-success">🟢 Après ({{ comparisonData.after.length }}) :</h4>
            <div class="comparison-box">
              <VChip
                v-for="perm in comparisonData.after.slice(0, 5)"
                :key="`after-${perm.permission}`"
                size="small"
                color="success"
                variant="tonal"
                class="ma-1"
              >
                {{ perm.permission }}
              </VChip>
              <div v-if="comparisonData.after.length > 5" class="text-caption text-medium-emphasis">
                +{{ comparisonData.after.length - 5 }} autres...
              </div>
            </div>
          </VCol>
        </VRow>
        
        <VAlert
          :type="comparisonData.hasChanged ? 'success' : 'error'"
          class="mt-2"
        >
          {{ comparisonData.hasChanged ? '✅ Changement détecté !' : '❌ Aucun changement détecté' }}
          {{ comparisonData.hasChanged ? `(${comparisonData.difference} permissions de différence)` : '' }}
        </VAlert>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { permissionsApiService } from '@/services/api/permissions'
import { showToast } from '@/components/toast/toastManager'

const testUserId = ref('ce0e94ef-9ec1-474f-a8c5-9b4bdca22e5e') // Pre-rempli avec l'ID des logs
const loading = ref(false)
const currentPermissions = ref<any[]>([])
const testResults = ref<any[]>([])
const comparisonData = ref<any>(null)

const loadPermissions = async () => {
  if (!testUserId.value) {
    showToast({ message: 'Veuillez entrer un ID utilisateur', type: 'error' })
    return
  }
  
  try {
    loading.value = true
    console.log('🧪 Test - Chargement des permissions pour:', testUserId.value)
    
    const response = await permissionsApiService.getUserPermissions(testUserId.value)
    currentPermissions.value = response.data || []
    
    testResults.value.push({
      action: 'Chargement des permissions',
      message: `${currentPermissions.value.length} permissions trouvées`,
      success: true
    })
    
    console.log('🧪 Permissions chargées:', currentPermissions.value)
    showToast({ message: `${currentPermissions.value.length} permissions chargées`, type: 'success' })
  } catch (error) {
    console.error('❌ Erreur chargement permissions:', error)
    testResults.value.push({
      action: 'Chargement des permissions',
      message: `Erreur: ${error?.message}`,
      success: false
    })
    showToast({ message: 'Erreur lors du chargement', type: 'error' })
  } finally {
    loading.value = false
  }
}

const testRevokePermission = async () => {
  if (currentPermissions.value.length === 0) {
    showToast({ message: 'Chargez d\'abord les permissions', type: 'warning' })
    return
  }
  
  // Prendre la première permission disponible
  const firstPermission = currentPermissions.value.find(p => p.user_id && !p.role_id)
  if (!firstPermission) {
    showToast({ message: 'Aucune permission directe trouvée à révoquer', type: 'warning' })
    return
  }
  
  try {
    loading.value = true
    
    // Sauvegarder l'état avant
    const beforePermissions = [...currentPermissions.value]
    
    console.log('🧪 Test - Révocation de la permission:', firstPermission.permission)
    
    // Révoquer la permission
    await permissionsApiService.revokePermissions(testUserId.value, [firstPermission.permission])
    
    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Recharger les permissions
    const response = await permissionsApiService.getUserPermissions(testUserId.value)
    const afterPermissions = response.data || []
    
    // Comparer
    const hasChanged = JSON.stringify(beforePermissions) !== JSON.stringify(afterPermissions)
    const difference = Math.abs(beforePermissions.length - afterPermissions.length)
    
    comparisonData.value = {
      before: beforePermissions,
      after: afterPermissions,
      hasChanged,
      difference
    }
    
    currentPermissions.value = afterPermissions
    
    testResults.value.push({
      action: `Révocation permission: ${firstPermission.permission}`,
      message: hasChanged ? `✅ Succès! ${difference} permissions de différence` : '❌ Aucun changement détecté',
      success: hasChanged
    })
    
    showToast({
      message: hasChanged ? 'Permission révoquée avec succès' : 'Aucun changement détecté',
      type: hasChanged ? 'success' : 'warning'
    })
    
  } catch (error) {
    console.error('❌ Erreur révocation permission:', error)
    testResults.value.push({
      action: 'Révocation permission',
      message: `Erreur: ${error?.message}`,
      success: false
    })
    showToast({ message: 'Erreur lors de la révocation', type: 'error' })
  } finally {
    loading.value = false
  }
}

const testRevokeRole = async () => {
  if (currentPermissions.value.length === 0) {
    showToast({ message: 'Chargez d\'abord les permissions', type: 'warning' })
    return
  }
  
  // Trouver un rôle à révoquer
  const rolePermission = currentPermissions.value.find(p => p.role_id)
  if (!rolePermission) {
    showToast({ message: 'Aucun rôle trouvé à révoquer', type: 'warning' })
    return
  }
  
  try {
    loading.value = true
    
    // Sauvegarder l'état avant
    const beforePermissions = [...currentPermissions.value]
    
    console.log('🧪 Test - Révocation du rôle ID:', rolePermission.role_id)
    
    // Révoquer le rôle
    await permissionsApiService.revokeRole(testUserId.value, rolePermission.role_id)
    
    // Attendre un peu
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Recharger les permissions
    const response = await permissionsApiService.getUserPermissions(testUserId.value)
    const afterPermissions = response.data || []
    
    // Comparer
    const hasChanged = JSON.stringify(beforePermissions) !== JSON.stringify(afterPermissions)
    const difference = Math.abs(beforePermissions.length - afterPermissions.length)
    
    comparisonData.value = {
      before: beforePermissions,
      after: afterPermissions,
      hasChanged,
      difference
    }
    
    currentPermissions.value = afterPermissions
    
    testResults.value.push({
      action: `Révocation rôle ID: ${rolePermission.role_id}`,
      message: hasChanged ? `✅ Succès! ${difference} permissions de différence` : '❌ Aucun changement détecté',
      success: hasChanged
    })
    
    showToast({
      message: hasChanged ? 'Rôle révoqué avec succès' : 'Aucun changement détecté',
      type: hasChanged ? 'success' : 'warning'
    })
    
  } catch (error) {
    console.error('❌ Erreur révocation rôle:', error)
    testResults.value.push({
      action: 'Révocation rôle',
      message: `Erreur: ${error?.message}`,
      success: false
    })
    showToast({ message: 'Erreur lors de la révocation', type: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.comparison-box {
  min-height: 60px;
  padding: 8px;
  border: 1px solid rgba(var(--v-border-color), 0.12);
  border-radius: 4px;
  background-color: rgba(var(--v-theme-surface-variant), 0.04);
}
</style>
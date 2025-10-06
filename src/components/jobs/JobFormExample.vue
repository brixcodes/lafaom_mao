<template>
  <VCard>
    <VCardText>
      <h3>Exemple d'utilisation des permissions</h3>
      
      <!-- Exemple 1: Vérification simple -->
      <div class="mb-4">
        <h4>1. Vérification simple</h4>
        <VBtn 
          v-if="hasPermission('can_create_job_offer')" 
          color="primary"
          @click="createJob"
        >
          Créer une offre d'emploi
        </VBtn>
        <VChip v-else color="error">
          Pas de permission pour créer
        </VChip>
      </div>

      <!-- Exemple 2: Avec directive -->
      <div class="mb-4">
        <h4>2. Avec directive</h4>
        <VBtn 
          v-permission="{ permission: 'can_update_job_offer' }"
          color="secondary"
          @click="editJob"
        >
          Modifier l'offre
        </VBtn>
        
        <VBtn 
          v-permission="{ permission: 'can_delete_job_offer', fallback: 'disable' }"
          color="error"
          @click="deleteJob"
        >
          Supprimer l'offre
        </VBtn>
      </div>

      <!-- Exemple 3: Vérification de rôle -->
      <div class="mb-4">
        <h4>3. Vérification de rôle</h4>
        <VChip v-if="isAdmin" color="success">
          Administrateur
        </VChip>
        <VChip v-else-if="isManager" color="info">
          Manager
        </VChip>
        <VChip v-else color="default">
          Visiteur
        </VChip>
      </div>

      <!-- Exemple 4: Actions conditionnelles -->
      <div class="mb-4">
        <h4>4. Actions conditionnelles</h4>
        <VBtn 
          v-if="canCreate('job_offer')"
          color="primary"
          @click="createJob"
        >
          Créer
        </VBtn>
        
        <VBtn 
          v-if="canUpdate('job_offer')"
          color="secondary"
          @click="editJob"
        >
          Modifier
        </VBtn>
        
        <VBtn 
          v-if="canDelete('job_offer')"
          color="error"
          @click="deleteJob"
        >
          Supprimer
        </VBtn>
      </div>

      <!-- Exemple 5: Informations de debug -->
      <div class="mb-4">
        <h4>5. Informations de debug</h4>
        <VCard variant="outlined">
          <VCardText>
            <p><strong>Rôle:</strong> {{ userRole }}</p>
            <p><strong>Niveau d'accès:</strong> {{ accessLevel }}</p>
            <p><strong>Peut créer des offres:</strong> {{ hasPermission('can_create_job_offer') }}</p>
            <p><strong>Peut modifier des offres:</strong> {{ hasPermission('can_update_job_offer') }}</p>
            <p><strong>Peut supprimer des offres:</strong> {{ hasPermission('can_delete_job_offer') }}</p>
          </VCardText>
        </VCard>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { computed } from 'vue'
import { useSimplePermissions } from '@/services/simplePermissions'
import { useAuthStore } from '@/stores/auth'

// Utilisation du service de permissions simplifié
const { 
  hasPermission, 
  hasPermissions, 
  hasRole, 
  isAdmin, 
  isManager, 
  isVisitor, 
  accessLevel 
} = useSimplePermissions()

const authStore = useAuthStore()

// Helpers pour les actions
const canCreate = (module: string) => hasPermission(`can_create_${module}`)
const canUpdate = (module: string) => hasPermission(`can_update_${module}`)
const canDelete = (module: string) => hasPermission(`can_delete_${module}`)

// Rôle de l'utilisateur
const userRole = computed(() => authStore.user?.role || 'visitor')

// Actions
const createJob = () => {
  console.log('Création d\'une offre d\'emploi')
}

const editJob = () => {
  console.log('Modification d\'une offre d\'emploi')
}

const deleteJob = () => {
  console.log('Suppression d\'une offre d\'emploi')
}
</script>

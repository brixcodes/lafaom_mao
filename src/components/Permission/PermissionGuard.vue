<template>
  <div>
    <!-- Afficher le contenu si l'utilisateur a les permissions -->
    <template v-if="hasRequiredPermissions">
      <slot />
    </template>
    
    <!-- Afficher le fallback si spécifié -->
    <template v-else-if="showFallback">
      <slot name="fallback">
        <VAlert 
          type="warning" 
          variant="tonal"
          class="ma-2"
        >
          <VIcon icon="ri-shield-cross-line" class="mr-2" />
          <strong>Accès restreint</strong>
          <p class="mt-2 mb-0">
            Vous n'avez pas les permissions nécessaires pour accéder à cette fonctionnalité.
          </p>
        </VAlert>
      </slot>
    </template>
    
    <!-- Ne rien afficher si pas de fallback -->
    <template v-else>
      <!-- Contenu masqué -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'
import { PermissionEnum } from '@/types/permissions'

interface Props {
  permissions: (PermissionEnum | string)[]
  requireAll?: boolean
  showFallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
  showFallback: false
})

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

// Vérifier si l'utilisateur a les permissions requises
const hasRequiredPermissions = computed(() => {
  if (props.requireAll) {
    return hasAllPermissions(props.permissions as PermissionEnum[])
  } else {
    return hasAnyPermission(props.permissions as PermissionEnum[])
  }
})
</script>
<template>
  <div>
    <VCard>
      <VTable :items="permissions" :headers="headers" @assign="assignPermission" @revoke="revokePermission" />
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { permissionService } from '@/services/api/permission'

const permissions = ref([])
const headers = [
  { title: 'Permission', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const fetchPermissions = async () => {
  permissions.value = await permissionService.getPermissions()
}

const assignPermission = (permission) => {
  // TODO: assign permission to user
}
const revokePermission = (permission) => {
  // TODO: revoke permission from user
}

onMounted(fetchPermissions)
</script>

<style scoped>
/* Soft, modern style */
</style>

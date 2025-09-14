
<template>
  <div class="user-detail-page">
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" aria-label="Retour" title="Retour" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>
      <h1 class="font-weight-bold ml-2">Détail utilisateur</h1>
    </div>
    <UserDetailCard v-if="user" :user="user" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UserDetailCard from '@/components/User/UserDetailCard.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userId = route.params.id as string
const user = ref<any>(null)

const goBack = () => {
  router.push('/users')
}

const fetchUser = async () => {
  await userStore.getUserById(userId)
  user.value = userStore.currentUser
}

onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.user-detail-page {
  padding: 2rem;
}
</style>

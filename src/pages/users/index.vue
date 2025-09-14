<!-- Page de liste des utilisateurs -->

<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 mb-2">
          Utilisateurs
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          Gérez tous les utilisateurs de votre application
        </p>
      </div>

      <VBtn color="primary" prepend-icon="ri-add-line" @click="goToCreate">
        Nouvel utilisateur
      </VBtn>
    </div>

    <!-- Statistiques utilisateurs -->
    <VRow class="mb-4">
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-shield-user-line" size="32" color="primary" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.admin }}</div>
                <div class="text-caption">Administrateur(s)</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-user-settings-line" size="32" color="info" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.staff }}</div>
                <div class="text-caption">Gestionnaire(s)</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-graduation-cap-line" size="32" color="success" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.teacher }}</div>
                <div class="text-caption">Enseignants(s)</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-user-line" size="32" color="warning" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.student }}</div>
                <div class="text-caption">Apprenants(s)</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-checkbox-circle-line" size="32" color="success" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.active }}</div>
                <div class="text-caption">Users Actifs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-close-circle-line" size="32" color="error" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.inactive }}</div>
                <div class="text-caption">Users Inactifs</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <!-- <VCol cols="12" md="2">
        <VCard>
          <VCardText>
            <div class="d-flex align-center">
              <VIcon icon="ri-group-line" size="32" color="secondary" class="mr-2" />
              <div>
                <div class="text-h5">{{ userStats.total }}</div>
                <div class="text-caption">Total</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol> -->
    </VRow>

    <!-- Barre de recherche et filtres -->
    <UserFilter :filters="filters" :user-type-options="userTypeOptions" :status-options="statusOptions"
      @search="handleSearch" @clear="handleClear" />

    <!-- Liste des utilisateurs -->
    <VCard>
      <VCardText>
        <div v-if="isLoading" class="text-center py-8">
          <LoadingSpinner message="Chargement des utilisateurs..." />
        </div>
        <ErrorHandler v-else-if="error && error !== 'User not found'" :error="error" @clear-error="clearError"
          @retry="fetchUsers" />
        <div v-else-if="users.length === 0 && (!error || error === 'User not found')" class="text-center py-8">
          <VIcon icon="ri-user-line" size="64" color="disabled" class="mb-4" />
          <h3 class="text-h6 mb-2">Aucun utilisateur trouvé</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">Commencez par créer votre premier utilisateur</p>
          <VBtn color="primary" @click="goToCreate">Créer un utilisateur</VBtn>
        </div>
        <div v-else>
          <UserTable :users="users" :headers="headers" :is-loading="isLoading" @detail="goToDetail" @edit="goToEdit"
            @delete="confirmDelete" />
          <!-- <UserPagination
            :page="pagination.page"
            :page-size="pagination.page_size"
            :total="pagination.total"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          /> -->
        </div>
      </VCardText>
    </VCard>

    <!-- Dialog de confirmation de suppression -->
    <UserDeleteDialog v-model="deleteDialog" @delete="deleteUser" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { userService } from '@/services/api/user'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Formatter } from '@/utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorHandler from '@/components/common/ErrorHandler.vue'
import UserPagination from '@/components/common/Pagination.vue'
import UserTable from '@/components/User/UserTable.vue'
import UserFilter from '@/components/User/UserFilter.vue'
import UserDeleteDialog from '@/components/User/UserDeleteDialog.vue'
import { showToast } from '@/components/toast/toastManager'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const deleteDialog = ref(false)
const userToDelete = ref(null)

const users = computed(() => userStore.users)
const isLoading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)
const pagination = computed(() => userStore.pagination)

// Stats utilisateurs calculées en temps réel
const userStats = ref({
  admin: 0,
  staff: 0,
  teacher: 0,
  student: 0,
  active: 0,
  inactive: 0,
  total: 0,
})

const computeUserStats = (userList: any[]) => {
  userStats.value = {
    admin: userList.filter(u => u.user_type === 'admin').length,
    staff: userList.filter(u => u.user_type === 'staff').length,
    teacher: userList.filter(u => u.user_type === 'teacher').length,
    student: userList.filter(u => u.user_type === 'student').length,
    active: userList.filter(u => u.status === 'active').length,
    inactive: userList.filter(u => u.status === 'inactive').length,
    total: userList.length,
  }
}

const filters = ref({
  page: 1,
  page_size: 20,
  search: '',
  user_type: undefined,
  status: undefined,
  order_by: 'created_at',
  asc: 'desc',
})

const userTypeOptions = ref<{ title: string; value: string }[]>([])
const statusOptions = ref<{ title: string; value: string }[]>([
  { value: 'active', title: 'Actif' },
  { value: 'inactive', title: 'Inactif' },
  { value: 'blocked', title: 'Bloqué' },
  { value: 'deleted', title: 'Supprimé' },
])

const fetchFilterOptions = async () => {
  // Fetch user types from API or fallback to enums
  try {
    const rolesRes = await userService.getRoles()
    userTypeOptions.value = rolesRes.data.map(role => ({ title: role.name, value: role.name }))
  } catch {
    userTypeOptions.value = [
      { title: 'Admin', value: 'admin' },
      { title: 'Staff', value: 'staff' },
      { title: 'Student', value: 'student' },
    ]
  }
}
const headers = [
  { title: '', key: 'picture', sortable: false, width: '60px' },
  { title: 'Utilisateur', key: 'full_name', sortable: true },
  { title: 'Téléphone', key: 'mobile_number', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Type', key: 'user_type', sortable: true },
  { title: 'Créé le', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' },
]

const fetchUsers = async () => {
  await userStore.fetchUsers(filters.value)
  computeUserStats(userStore.users)
}
const handleSearch = (query: string) => {
  filters.value.search = query
  filters.value.page = 1
  fetchUsers()
}
const handleClear = () => {
  searchQuery.value = ''
  filters.value.search = ''
  filters.value.page = 1
  fetchUsers()
}
const handlePageChange = (page: number) => {
  filters.value.page = page
  fetchUsers()
}
const handlePageSizeChange = (pageSize: number) => {
  filters.value.page_size = pageSize
  filters.value.page = 1
  fetchUsers()
}
const goToCreate = () => router.push('/users/create')
const goToDetail = (id: string) => router.push(`/users/${id}`)
const goToEdit = (id: string) => router.push(`/users/${id}/edit`)
const confirmDelete = (user: any) => {
  userToDelete.value = user
  deleteDialog.value = true
}
const deleteUser = async () => {
  if (!userToDelete.value) return
  await userStore.deleteUser((userToDelete.value as any).id)
  deleteDialog.value = false
  userToDelete.value = null
  showToast({ message: 'Utilisateur supprimé avec succès.', type: 'success' })
}
const clearError = () => userStore.clearError()
onMounted(() => {
  fetchFilterOptions()
  fetchUsers()
})

// Filtrage réactif sur type et statut
watch(() => filters.value.user_type, () => {
  filters.value.page = 1
  fetchUsers()
})
watch(() => filters.value.status, () => {
  filters.value.page = 1
  fetchUsers()
})
</script>

<style scoped>
.v-data-table {
  border-radius: 0;
}
</style>

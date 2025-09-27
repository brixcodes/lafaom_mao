// UI Components
import { VBtn, VCard, VCardText, VDivider, VList, VListItem, VListItemTitle } from 'vuetify/components'

// Types
import type { Specialty } from '@/types/training'

// Store
import { useTrainingStore } from '@/stores/training'

export default defineComponent({
  name: 'SpecialtyList',
  
  components: {
    VBtn,
    VCard,
    VCardText,
    VDivider,
    VList,
    VListItem,
    VListItemTitle,
  },
  
  setup() {
    const trainingStore = useSpecialtyStore()
    const router = useRouter()
    
    onMounted(async () => {
      await trainingStore.fetchSpecialties()
    })
    
    const handleCreate = () => {
      router.push({ name: 'specialty-create' })
    }
    
    const handleEdit = (id: number) => {
      router.push({ name: 'specialty-edit', params: { id: id.toString() } })
    }
    
    const handleDelete = async (id: number) => {
      try {
        await trainingStore.deleteSpecialty(id)
      } catch (error) {
        console.error('Error deleting specialty:', error)
      }
    }
    
    return {
      specialties: computed(() => trainingStore.specialties),
      isLoading: computed(() => trainingStore.isLoading),
      handleCreate,
      handleEdit,
      handleDelete,
    }
  },
})

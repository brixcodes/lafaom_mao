// UI Components
import { VBtn, VCard, VCardText, VDivider, VList, VListItem, VListItemTitle } from 'vuetify/components'

// Types
import type { Specialty } from '@/types/training'

// Store
import { useSpecialtyStore } from '@/stores/specialty'

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
    const specialtyStore = useSpecialtyStore()
    const router = useRouter()
    
    onMounted(async () => {
      await specialtyStore.fetchSpecialties()
    })
    
    const handleCreate = () => {
      router.push({ name: 'specialty-create' })
    }
    
    const handleEdit = (id: number) => {
      router.push({ name: 'specialty-edit', params: { id: id.toString() } })
    }
    
    const handleDelete = async (id: number) => {
      try {
        await specialtyStore.deleteSpecialty(id)
      } catch (error) {
        console.error('Error deleting specialty:', error)
      }
    }
    
    return {
      specialties: computed(() => specialtyStore.specialties),
      isLoading: computed(() => specialtyStore.isLoading),
      handleCreate,
      handleEdit,
      handleDelete,
    }
  },
})

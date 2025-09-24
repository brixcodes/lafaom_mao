// UI Components
import { VBtn, VCard, VCardText, VForm, VTextField, VTextarea } from 'vuetify/components'

// Types
import type { Specialty } from '@/types/training'

// Store
import { useSpecialtyStore } from '@/stores/specialty'

export default defineComponent({
  name: 'SpecialtyForm',
  
  components: {
    VBtn,
    VCard,
    VCardText,
    VForm,
    VTextField,
    VTextarea,
  },
  
  props: {
    specialtyId: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  
  setup(props) {
    const specialtyStore = useSpecialtyStore()
    const router = useRouter()
    
    const form = ref({
      name: '',
      description: '',
    })
    
    // Load specialty data if editing
    onMounted(async () => {
      if (props.specialtyId) {
        try {
          const specialty = await specialtyStore.getSpecialtyById(props.specialtyId)
          form.value = {
            name: specialty.name,
            description: specialty.description || '',
          }
        } catch (error) {
          console.error('Error loading specialty:', error)
          router.push({ name: 'specialty-list' })
        }
      }
    })
    
    const handleSubmit = async () => {
      try {
        if (props.specialtyId) {
          await specialtyStore.updateSpecialty(props.specialtyId, form.value)
        } else {
          await specialtyStore.createSpecialty(form.value)
        }
        
        router.push({ name: 'specialty-list' })
      } catch (error) {
        console.error('Error saving specialty:', error)
      }
    }
    
    const handleCancel = () => {
      router.push({ name: 'specialty-list' })
    }
    
    return {
      form,
      handleSubmit,
      handleCancel,
      isLoading: computed(() => specialtyStore.isLoading),
    }
  },
})

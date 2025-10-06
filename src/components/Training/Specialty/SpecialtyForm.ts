// UI Components
import { VBtn, VCard, VCardText, VForm, VTextField, VTextarea } from 'vuetify/components'

// Types
import type { Specialty } from '@/types/training'

// Store
import { useTrainingStore } from '@/stores/training'

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
    const trainingStore = useTrainingStore()
    const router = useRouter()
    
    const form = ref({
      name: '',
      description: '',
    })
    
    // Load specialty data if editing
    onMounted(async () => {
      if (props.specialtyId) {
        try {
          const specialty = await trainingStore.getSpecialtyById(props.specialtyId)
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
          await trainingStore.updateSpecialty(props.specialtyId, form.value)
        } else {
          await trainingStore.createSpecialty(form.value)
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
      isLoading: computed(() => trainingStore.isLoading),
    }
  },
})

<!-- <template>
  <VCard v-if="showDebug" class="mb-4" color="warning" variant="tonal">
    <VCardTitle class="d-flex align-center">
      <VIcon icon="ri-bug-line" class="me-2" />
      <span>Debug - Données à envoyer</span>
      <VSpacer />
      <VBtn icon="ri-close-line" size="small" @click="showDebug = false" />
    </VCardTitle>
    <VDivider />
    <VCardText>
      <pre class="text-caption">{{ JSON.stringify(data, null, 2) }}</pre>
    </VCardText>
  </VCard>
</template> -->
<!-- 
<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  data: any
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const showDebug = ref(props.show)

watch(() => props.data, () => {
  if (props.show) {
    showDebug.value = true
  }
}, { deep: true })
</script>

<style scoped>
pre {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}
</style> -->

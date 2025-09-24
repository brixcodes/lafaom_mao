<script lang="ts" setup>
import { ref, watch, onUnmounted } from 'vue'
const props = defineProps<{
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  icon?: string
}>()
const visible = ref(true)
let timer: number | undefined
const close = () => {
  visible.value = false
}
watch(
  () => props.message,
  () => {
    visible.value = true
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(close, props.duration ?? 3500)
  },
  { immediate: true }
)
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Transition name="toast-fade">
    <div v-if="visible" class="toast" :class="type">
      <span v-if="icon" class="toast__icon">{{ icon }}</span>
      <span class="toast__message">{{ message }}</span>
      <button class="toast__close" @click="close">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 15px;
  margin: 10px 0;
  position: relative;
  animation: toast-fadein 0.3s;
}

.toast.success {
  background: #e6ffed;
  color: #1a7f37;
  border-left: 4px solid #1a7f37;
}

.toast.error {
  background: #ffeaea;
  color: #d32f2f;
  border-left: 4px solid #d32f2f;
}

.toast.info {
  background: #e8f4fd;
  color: #1976d2;
  border-left: 4px solid #1976d2;
}

.toast.warning {
  background: #fff8e1;
  color: #b26a00;
  border-left: 4px solid #b26a00;
}

.toast__icon {
  margin-right: 10px;
  font-size: 18px;
}

.toast__close {
  background: none;
  border: none;
  color: inherit;
  font-size: 18px;
  margin-left: 12px;
  cursor: pointer;
}

.toast__message {
  flex: 1;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
}

@keyframes toast-fadein {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>

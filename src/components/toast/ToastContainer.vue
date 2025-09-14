<template>
  <div class="toast-container">
    <Toast
      v-for="(toast, i) in toasts"
      :key="i + toast.message"
      v-bind="toast"
      @close="removeToast(i)"
    />
  </div>
</template>

<script lang="ts" setup>
import Toast from './Toast.vue'
import { useToasts } from './toastManager'

const { toasts, removeToast } = useToasts()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>

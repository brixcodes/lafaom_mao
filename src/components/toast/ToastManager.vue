<template>
  <div class="toast-container">
    <TransitionGroup name="toast-fade" tag="div">
      <div
        v-for="(toast, index) in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <span v-if="toast.icon" class="toast__icon">{{ toast.icon }}</span>
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" @click="removeToast(index)">×</button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToasts } from './toastManager'

const { toasts, removeToast } = useToasts()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  display: flex;
  align-items: center;
  min-width: 220px;
  max-width: 350px;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-size: 15px;
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
  transition: all 0.3s;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
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

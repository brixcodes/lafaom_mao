<template>
  <VCard
    :title="title"
    :subtitle="subtitle"
    :class="cardClass"
  >
    <template v-if="$slots.actions" #actions>
      <slot name="actions" />
    </template>
    
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    
    <slot />
  </VCard>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  cardClass?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  cardClass: ''
})
</script>

<template>
  <VCard>
    <VCardTitle>Statistiques par pays</VCardTitle>
    <VCardText>
      <div class="geographic-stats">
        <div
          v-for="country in countries"
          :key="country.code"
          class="country-item d-flex align-center justify-space-between mb-3 pa-3 rounded"
        >
          <div class="d-flex align-center">
            <VAvatar
              :color="getCountryColor(country.code)"
              size="32"
              class="me-3"
            >
              <span class="text-caption font-weight-bold">{{ country.code }}</span>
            </VAvatar>
            <div>
              <div class="text-body-2 font-weight-medium">
                {{ country.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ country.sales }} ventes
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-h6 font-weight-bold">
              {{ formatCurrency(country.revenue) }}
            </div>
            <div 
              class="text-caption d-flex align-center"
              :class="country.growth >= 0 ? 'text-success' : 'text-error'"
            >
              <VIcon 
                :icon="country.growth >= 0 ? 'tabler-trending-up' : 'tabler-trending-down'" 
                size="16" 
                class="me-1" 
              />
              {{ Math.abs(country.growth) }}%
            </div>
          </div>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Country {
  code: string
  name: string
  revenue: number
  sales: number
  growth: number
}

const countries = ref<Country[]>([
  {
    code: 'FR',
    name: 'France',
    revenue: 8656000,
    sales: 894000,
    growth: 25.8
  },
  {
    code: 'US',
    name: 'États-Unis',
    revenue: 2415000,
    sales: 645000,
    growth: -6.2
  },
  {
    code: 'DE',
    name: 'Allemagne',
    revenue: 865000,
    sales: 148000,
    growth: 12.4
  },
  {
    code: 'IT',
    name: 'Italie',
    revenue: 745000,
    sales: 86000,
    growth: -11.9
  },
  {
    code: 'ES',
    name: 'Espagne',
    revenue: 45000,
    sales: 42000,
    growth: 18.2
  },
  {
    code: 'BE',
    name: 'Belgique',
    revenue: 12000,
    sales: 8000,
    growth: 14.8
  }
])

const getCountryColor = (code: string) => {
  const colors = {
    'FR': 'primary',
    'US': 'success',
    'DE': 'warning',
    'IT': 'info',
    'ES': 'secondary',
    'BE': 'error'
  }
  return colors[code as keyof typeof colors] || 'primary'
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
.country-item {
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.country-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(var(--v-theme-primary), 0.2);
}
</style>

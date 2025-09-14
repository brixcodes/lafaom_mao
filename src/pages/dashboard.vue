<script setup lang="ts">
import CardStatisticsVertical from '@core/components/cards/CardStatisticsVertical.vue'

const totalUsers = {
  title: 'Total Users',
  color: 'primary',
  icon: 'ri-user-line',
  stats: '1,234',
  change: 12,
  subtitle: 'This month',
}

const totalRevenue = {
  title: 'Total Revenue',
  color: 'success',
  icon: 'ri-money-dollar-circle-line',
  stats: '$45,678',
  change: 8,
  subtitle: 'This month',
}

const totalOrders = {
  title: 'Total Orders',
  color: 'info',
  icon: 'ri-shopping-cart-line',
  stats: '567',
  change: -3,
  subtitle: 'This month',
}

const totalProducts = {
  title: 'Total Products',
  color: 'warning',
  icon: 'ri-box-line',
  stats: '89',
  change: 5,
  subtitle: 'This month',
}
</script>

<template>
  <div>
    <h1 class="text-h4 mb-6">
      Dashboard
    </h1>
    
    <VRow class="match-height">
      <VCol
        cols="12"
        sm="6"
        lg="3"
      >
        <CardStatisticsVertical v-bind="totalUsers" />
      </VCol>

      <VCol
        cols="12"
        sm="6"
        lg="3"
      >
        <CardStatisticsVertical v-bind="totalRevenue" />
      </VCol>

      <VCol
        cols="12"
        sm="6"
        lg="3"
      >
        <CardStatisticsVertical v-bind="totalOrders" />
      </VCol>

      <VCol
        cols="12"
        sm="6"
        lg="3"
      >
        <CardStatisticsVertical v-bind="totalProducts" />
      </VCol>
    </VRow>

    <VRow class="mt-6">
      <VCol cols="12">
        <VCard>
          <VCardTitle>
            Welcome to Your Application
          </VCardTitle>
          <VCardText>
            <p class="text-body-1 mb-4">
              This is your clean dashboard template. You can now start building your application by:
            </p>
            <ul class="text-body-1">
              <li>Adding new pages and components</li>
              <li>Integrating with your backend API</li>
              <li>Customizing the design and layout</li>
              <li>Adding authentication logic</li>
            </ul>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

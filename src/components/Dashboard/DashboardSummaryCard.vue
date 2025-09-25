<template>
  <VCard class="summary-card">
    <VCardText class="pa-6">
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <h3 class="text-h5 font-weight-bold mb-2">
            Résumé LAFOAM
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            Vue d'ensemble de votre plateforme éducative
          </p>
        </div>
        <VAvatar
          size="64"
          color="primary"
          variant="tonal"
        >
          <VIcon icon="tabler-trophy" size="32" />
        </VAvatar>
      </div>
      
      <!-- Statistiques principales -->
      <div class="stats-grid mb-4">
        <div class="stat-item text-center">
          <div class="text-h4 font-weight-bold text-primary mb-1">1,247</div>
          <div class="text-caption">Utilisateurs</div>
        </div>
        <div class="stat-item text-center">
          <div class="text-h4 font-weight-bold text-success mb-1">45</div>
          <div class="text-caption">Formations</div>
        </div>
        <div class="stat-item text-center">
          <div class="text-h4 font-weight-bold text-warning mb-1">67</div>
          <div class="text-caption">Emplois</div>
        </div>
        <div class="stat-item text-center">
          <div class="text-h4 font-weight-bold text-info mb-1">45.6k€</div>
          <div class="text-caption">Revenus</div>
        </div>
      </div>
      
      <!-- Progression -->
      <div class="progress-section mb-4">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-body-2 font-weight-medium">Progression mensuelle</span>
          <span class="text-body-2 font-weight-bold text-primary">72%</span>
        </div>
        <VProgressLinear
          model-value="72"
          color="primary"
          height="8"
          rounded
        />
        <div class="text-caption text-medium-emphasis mt-1">
          Objectif: 100% - Reste: 28%
        </div>
      </div>
      
      <!-- Actions -->
      <div class="d-flex gap-2">
        <VBtn
          color="primary"
          variant="elevated"
          size="small"
        >
          <VIcon start icon="tabler-chart-line" />
          Rapport
        </VBtn>
        <VBtn
          color="success"
          variant="outlined"
          size="small"
        >
          <VIcon start icon="tabler-download" />
          Exporter
        </VBtn>
        <VBtn
          color="info"
          variant="outlined"
          size="small"
        >
          <VIcon start icon="tabler-settings" />
          Configurer
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
// Pas de logique complexe nécessaire pour ce composant
</script>

<style scoped>
.summary-card {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  padding: 16px;
  background-color: rgba(var(--v-theme-surface), 0.5);
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-border), 0.12);
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.progress-section {
  background-color: rgba(var(--v-theme-surface), 0.5);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-theme-border), 0.12);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <VCard class="final-summary">
    <VCardText class="pa-6">
      <div class="text-center mb-6">
        <h2 class="text-h4 font-weight-bold mb-2">
          🎉 Félicitations ! Votre plateforme LAFOAM fonctionne parfaitement
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          Vous avez créé un écosystème éducatif complet et performant
        </p>
      </div>
      
      <!-- Statistiques finales -->
      <div class="final-stats mb-6">
        <VRow>
          <VCol cols="12" sm="6" md="3">
            <div class="text-center pa-4 rounded bg-primary-lighten-5">
              <div class="text-h3 font-weight-bold text-primary mb-1">1,247</div>
              <div class="text-caption">Utilisateurs actifs</div>
              <div class="text-caption text-success">+12.5% ce mois</div>
            </div>
          </VCol>
          <VCol cols="12" sm="6" md="3">
            <div class="text-center pa-4 rounded bg-success-lighten-5">
              <div class="text-h3 font-weight-bold text-success mb-1">45</div>
              <div class="text-caption">Formations actives</div>
              <div class="text-caption text-success">+8 nouvelles</div>
            </div>
          </VCol>
          <VCol cols="12" sm="6" md="3">
            <div class="text-center pa-4 rounded bg-warning-lighten-5">
              <div class="text-h3 font-weight-bold text-warning mb-1">67</div>
              <div class="text-caption">Offres d'emploi</div>
              <div class="text-caption text-success">+15 ce mois</div>
            </div>
          </VCol>
          <VCol cols="12" sm="6" md="3">
            <div class="text-center pa-4 rounded bg-info-lighten-5">
              <div class="text-h3 font-weight-bold text-info mb-1">45.6k€</div>
              <div class="text-caption">Revenus totaux</div>
              <div class="text-caption text-success">+8.3% ce mois</div>
            </div>
          </VCol>
        </VRow>
      </div>
      
      <!-- Progression globale -->
      <div class="global-progress mb-6">
        <div class="d-flex justify-space-between align-center mb-3">
          <span class="text-h6 font-weight-medium">Progression globale de la plateforme</span>
          <span class="text-h6 font-weight-bold text-primary">85%</span>
        </div>
        <VProgressLinear
          model-value="85"
          color="primary"
          height="12"
          rounded
        />
        <div class="text-caption text-medium-emphasis mt-2">
          Excellent travail ! Votre plateforme est en pleine croissance
        </div>
      </div>
      
      <!-- Actions finales -->
      <div class="d-flex justify-center gap-3 flex-wrap">
        <VBtn
          color="primary"
          variant="elevated"
          size="large"
        >
          <VIcon start icon="tabler-chart-line" />
          Voir le rapport complet
        </VBtn>
        <VBtn
          color="success"
          variant="outlined"
          size="large"
        >
          <VIcon start icon="tabler-download" />
          Exporter toutes les données
        </VBtn>
        <VBtn
          color="info"
          variant="outlined"
          size="large"
        >
          <VIcon start icon="tabler-settings" />
          Configurer la plateforme
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
// Pas de logique complexe nécessaire pour ce composant
</script>

<style scoped>
.final-summary {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
}

.final-stats {
  background-color: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-border), 0.12);
}

.global-progress {
  background-color: rgba(var(--v-theme-surface), 0.5);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(var(--v-theme-border), 0.12);
}

@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
    align-items: center;
  }
  
  .d-flex.gap-3 .v-btn {
    width: 100%;
    max-width: 300px;
  }
}
</style>
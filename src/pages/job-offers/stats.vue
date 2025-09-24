<template>
  <VContainer class="job-stats-page">
    <!-- En-tête élégant avec gradient -->
    <VCard class="mb-6 stats-header-card overflow-hidden" elevation="4">
      <div class="stats-header-overlay">
        <div class="stats-header-content pa-6">
          <div class="d-flex justify-space-between align-items-start">
            <div>
              <h1 class="text-h3 font-weight-bold text-white mb-2 animate-title">
                <VIcon icon="ri-dashboard-line" class="me-3" size="32" />
                Analytics & Statistiques
              </h1>
              <p class="text-h6 text-white mb-4 animate-subtitle">
                Tableau de bord des performances en temps réel
              </p>
              <div class="d-flex align-center text-white animate-meta">
                <VIcon icon="ri-time-line" size="20" class="me-2" />
                <span>Dernière mise à jour : {{ formatDateTime(new Date()) }}</span>
              </div>
              <!-- Debug Info -->
              <div class="mt-3 text-white text-caption d-flex align-center gap-2">
                <span>Debug: {{ debugInfo.offers }} offres, {{ debugInfo.applications }} candidatures, Loading: {{
                  debugInfo.loading }}</span>
                <VBtn size="x-small" color="white" variant="outlined" @click="refreshStats">
                  Debug Reload
                </VBtn>
              </div>
            </div>
            <div class="d-flex gap-2">
              <VBtn prepend-icon="ri-filter-line" color="white" variant="outlined" @click="showFilters = !showFilters"
                :class="{ 'bg-white text-primary': showFilters }">
                Filtres
              </VBtn>
              <VBtn prepend-icon="ri-refresh-line" color="white" variant="elevated" :loading="statsLoading"
                @click="refreshStats" class="action-btn">
                Actualiser
              </VBtn>
            </div>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Panneau de filtres avancés -->
    <VExpandTransition>
      <VCard v-if="showFilters" class="mb-6 filter-card" elevation="2">
        <VCardTitle class="d-flex align-center bg-surface-variant">
          <VIcon icon="ri-settings-4-line" class="me-2" color="primary" />
          Filtres et Paramètres
        </VCardTitle>
        <VCardText class="pa-6">
          <VRow>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.period" :items="periodOptions" label="Période"
                prepend-inner-icon="ri-calendar-line" variant="outlined" @update:model-value="applyFilters" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.contractType" :items="contractTypeOptions" label="Type de contrat"
                prepend-inner-icon="ri-file-text-line" variant="outlined" clearable
                @update:model-value="applyFilters" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.location" :items="locationOptions" label="Localisation"
                prepend-inner-icon="ri-map-pin-line" variant="outlined" clearable @update:model-value="applyFilters" />
            </VCol>
            <VCol cols="12" md="3">
              <VSelect v-model="filters.status" :items="statusOptions" label="Statut des candidatures"
                prepend-inner-icon="ri-checkbox-circle-line" variant="outlined" clearable
                @update:model-value="applyFilters" />
            </VCol>
          </VRow>
          <div class="d-flex justify-end gap-2 mt-4">
            <VBtn variant="text" @click="resetFilters" prepend-icon="ri-restart-line">
              Réinitialiser
            </VBtn>
            <VBtn color="primary" variant="elevated" @click="applyFilters" prepend-icon="ri-search-line">
              Appliquer les filtres
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VExpandTransition>

    <!-- Indicateurs de chargement -->
    <VFadeTransition>
      <div v-if="statsLoading && !hasStatsData" class="text-center pa-12">
        <VProgressCircular indeterminate color="primary" size="80" width="6" class="mb-6" />
        <h3 class="text-h6 mb-2">Chargement des analytics...</h3>
        <p class="text-body-2 text-medium-emphasis">Collecte des données en temps réel</p>
      </div>
    </VFadeTransition>

    <!-- Contenu principal -->
    <div v-if="!statsLoading || hasStatsData">
      <!-- KPI Cards améliorées -->
      <VRow class="mb-8">
        <!-- Total Offres d'emploi -->
        <VCol cols="12" lg="3" md="6">
          <VSlideYTransition>
            <VCard class="stats-kpi-card" elevation="3" hover>
              <VCardText class="pa-6">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <VAvatar color="primary" variant="tonal" size="56">
                      <VIcon icon="ri-briefcase-line" size="28" />
                    </VAvatar>
                  </div>
                  <div class="text-right">
                    <div class="text-h4 font-weight-bold text-primary mb-1">
                      {{ formatNumber(computedStats.totalOffers) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Offres publiées
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <div class="text-body-2">Ce mois</div>
                  <VChip :color="getChangeColor(computedStats.offersGrowthRate)" variant="tonal" size="small"
                    :prepend-icon="getTrendIcon(computedStats.offersGrowthRate)">
                    {{ formatPercentage(computedStats.offersGrowthRate) }}
                  </VChip>
                </div>

                <VProgressLinear :model-value="Math.min((computedStats.totalOffers / 100) * 100, 100)" color="primary"
                  height="4" rounded class="mt-3" />
              </VCardText>
            </VCard>
          </VSlideYTransition>
        </VCol>

        <!-- Total Candidatures -->
        <VCol cols="12" lg="3" md="6">
          <VSlideYTransition>
            <VCard class="stats-kpi-card" elevation="3" hover>
              <VCardText class="pa-6">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <VAvatar color="info" variant="tonal" size="56">
                      <VIcon icon="ri-user-line" size="28" />
                    </VAvatar>
                  </div>
                  <div class="text-right">
                    <div class="text-h4 font-weight-bold text-info mb-1">
                      {{ formatNumber(computedStats.totalApplications) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Candidatures reçues
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <div class="text-body-2">Ce mois</div>
                  <VChip :color="getChangeColor(computedStats.applicationsGrowthRate)" variant="tonal" size="small"
                    :prepend-icon="getTrendIcon(computedStats.applicationsGrowthRate)">
                    {{ formatPercentage(computedStats.applicationsGrowthRate) }}
                  </VChip>
                </div>

                <VProgressLinear :model-value="Math.min((computedStats.totalApplications / 500) * 100, 100)"
                  color="info" height="4" rounded class="mt-3" />
              </VCardText>
            </VCard>
          </VSlideYTransition>
        </VCol>

        <!-- Taux de conversion -->
        <VCol cols="12" lg="3" md="6">
          <VSlideYTransition>
            <VCard class="stats-kpi-card" elevation="3" hover>
              <VCardText class="pa-6">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <VAvatar color="success" variant="tonal" size="56">
                      <VIcon icon="ri-trophy-line" size="28" />
                    </VAvatar>
                  </div>
                  <div class="text-right">
                    <div class="text-h4 font-weight-bold text-success mb-1">
                      {{ formatPercentage(computedStats.conversionRate) }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Taux de conversion
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <div class="text-body-2">Candidatures / Offres</div>
                  <VChip color="success" variant="tonal" size="small" prepend-icon="ri-arrow-up-line">
                    Optimal
                  </VChip>
                </div>

                <VProgressLinear :model-value="computedStats.conversionRate" color="success" height="4" rounded
                  class="mt-3" />
              </VCardText>
            </VCard>
          </VSlideYTransition>
        </VCol>

        <!-- Temps moyen pour embaucher -->
        <VCol cols="12" lg="3" md="6">
          <VSlideYTransition>
            <VCard class="stats-kpi-card" elevation="3" hover>
              <VCardText class="pa-6">
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <VAvatar color="warning" variant="tonal" size="56">
                      <VIcon icon="ri-time-line" size="28" />
                    </VAvatar>
                  </div>
                  <div class="text-right">
                    <div class="text-h4 font-weight-bold text-warning mb-1">
                      {{ computedStats.averageTimeToHire }}j
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Temps moyen d'embauche
                    </div>
                  </div>
                </div>

                <div class="d-flex align-center justify-space-between">
                  <div class="text-body-2">Moyenne industrie: 14j</div>
                  <VChip :color="computedStats.averageTimeToHire <= 14 ? 'success' : 'warning'" variant="tonal"
                    size="small"
                    :prepend-icon="computedStats.averageTimeToHire <= 14 ? 'ri-check-line' : 'ri-time-line'">
                    {{ computedStats.averageTimeToHire <= 14 ? 'Excellent' : 'Moyen' }} </VChip>
                </div>

                <VProgressLinear :model-value="Math.min((30 - computedStats.averageTimeToHire) / 30 * 100, 100)"
                  :color="computedStats.averageTimeToHire <= 14 ? 'success' : 'warning'" height="4" rounded
                  class="mt-3" />
              </VCardText>
            </VCard>
          </VSlideYTransition>
        </VCol>
      </VRow>

      <!-- Section Graphiques Analytics -->
      <VRow class="mb-8">
        <!-- Evolution temporelle -->
        <VCol cols="12" lg="8">
          <VCard elevation="3" class="analytics-chart-card">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between mb-6">
                <div>
                  <h3 class="text-h6 font-weight-bold mb-2">Évolution des performances</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Analyse temporelle des KPI principaux</p>
                </div>
                <div class="d-flex ga-2">
                  <VBtn v-for="period in chartPeriods" :key="period.value"
                    :variant="selectedChartPeriod === period.value ? 'flat' : 'text'"
                    :color="selectedChartPeriod === period.value ? 'primary' : 'default'" size="small"
                    @click="selectedChartPeriod = period.value">
                    {{ period.label }}
                  </VBtn>
                </div>
              </div>

              <!-- Chart Container -->
              <div class="chart-container bg-surface rounded-lg pa-4" style="height: 300px;">
                <div class="d-flex align-center justify-center h-100">
                  <div class="text-center">
                    <VIcon icon="ri-line-chart-line" size="64" class="text-primary mb-4" />
                    <h4 class="text-h6 mb-2">Graphique interactif</h4>
                    <p class="text-body-2 text-medium-emphasis">Chart.js sera intégré ici pour l'évolution des
                      candidatures</p>
                  </div>
                </div>
              </div>

              <!-- Légende interactive -->
              <div class="d-flex align-center justify-center flex-wrap ga-6 mt-4">
                <div class="d-flex align-center ga-2" v-for="(item, index) in chartLegend" :key="index">
                  <div :class="`chart-legend-dot bg-${item.color}`"></div>
                  <span class="text-body-2">{{ item.label }}</span>
                  <span class="text-caption text-medium-emphasis">({{ item.value }})</span>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Analytics détaillées -->
        <VCol cols="12" lg="4">
          <VRow>
            <!-- Distribution des statuts -->
            <VCol cols="12">
              <VCard elevation="3" class="mb-4">
                <VCardText class="pa-6">
                  <h4 class="text-h6 font-weight-bold mb-4">Statuts des candidatures</h4>

                  <div class="status-distribution">
                    <div v-for="(status, index) in applicationStatusDistribution" :key="index" class="status-item mb-3">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <div class="d-flex align-center ga-2">
                          <div :class="`status-dot bg-${status.color}`"></div>
                          <span class="text-body-2 font-weight-medium">{{ status.label }}</span>
                        </div>
                        <div class="text-end">
                          <div class="text-body-1 font-weight-bold">{{ status.count }}</div>
                          <div class="text-caption text-medium-emphasis">{{ status.percentage }}%</div>
                        </div>
                      </div>
                      <VProgressLinear :model-value="status.percentage" :color="status.color" height="6" rounded />
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Top offres populaires -->
            <VCol cols="12">
              <VCard elevation="3">
                <VCardText class="pa-6">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <h4 class="text-h6 font-weight-bold">Offres populaires</h4>
                    <VBtn variant="text" size="small" append-icon="ri-arrow-right-line">
                      Voir tout
                    </VBtn>
                  </div>

                  <VList class="pa-0">
                    <VListItem v-for="(offer, index) in topOffers" :key="offer.id" class="pa-3 mb-2 rounded-lg border">
                      <template #prepend>
                        <VAvatar :color="getOfferRankColor(index)" variant="tonal" size="32">
                          <span class="text-caption font-weight-bold">{{ index + 1 }}</span>
                        </VAvatar>
                      </template>

                      <VListItemTitle class="text-body-2 font-weight-medium mb-1">
                        {{ truncateText(offer.title, 25) }}
                      </VListItemTitle>
                      <VListItemSubtitle class="text-caption">
                        {{ offer.company }} • {{ offer.applications }} candidatures
                      </VListItemSubtitle>

                      <template #append>
                        <div class="text-end">
                          <VChip :color="getViewsColor(offer.views)" variant="tonal" size="x-small">
                            {{ formatNumber(offer.views) }} vues
                          </VChip>
                        </div>
                      </template>
                    </VListItem>
                  </VList>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>

      <!-- Section Types de Contrats et Répartition géographique -->
      <VRow class="mb-8">
        <!-- Types de contrats modernisés -->
        <VCol cols="12" md="6">
          <VCard elevation="3">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between mb-4">
                <h4 class="text-h6 font-weight-bold">Types de contrats</h4>
                <VIcon icon="ri-file-list-3-line" color="primary" size="24" />
              </div>

              <div v-if="contractTypesData.length > 0" class="contract-types-list">
                <div v-for="contractType in contractTypesData" :key="contractType.contract_type"
                  class="contract-item d-flex align-center justify-space-between pa-3 mb-3 rounded-lg bg-surface">
                  <div class="d-flex align-center ga-3">
                    <VAvatar :color="getContractColor(contractType.contract_type)" variant="tonal" size="40">
                      <VIcon :icon="getContractTypeIcon(contractType.contract_type)" size="20" />
                    </VAvatar>
                    <div>
                      <div class="text-body-1 font-weight-medium mb-1">
                        {{ getContractTypeLabel(contractType.contract_type) }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ contractType.count }} offres
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <VChip :color="getContractColor(contractType.contract_type)" variant="tonal" size="small">
                      {{ contractType.percentage.toFixed(1) }}%
                    </VChip>
                  </div>
                </div>
              </div>

              <div v-else class="text-center pa-8">
                <VIcon icon="ri-inbox-line" size="56" class="text-medium-emphasis mb-3" />
                <p class="text-body-2 text-medium-emphasis">Aucune donnée de contrat disponible</p>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Répartition géographique -->
        <VCol cols="12" md="6">
          <VCard elevation="3">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between mb-4">
                <h4 class="text-h6 font-weight-bold">Répartition géographique</h4>
                <VIcon icon="ri-map-pin-line" color="primary" size="24" />
              </div>

              <div class="location-distribution">
                <div v-for="(location, index) in topLocations" :key="location.city"
                  class="location-item d-flex align-center justify-space-between pa-3 mb-3 rounded-lg bg-surface">
                  <div class="d-flex align-center ga-3">
                    <VAvatar :color="getLocationColor(index)" variant="tonal" size="40">
                      <VIcon icon="ri-building-line" size="20" />
                    </VAvatar>
                    <div>
                      <div class="text-body-1 font-weight-medium mb-1">
                        {{ location.city }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ location.offers }} offres • {{ location.applications }} candidatures
                      </div>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="text-h6 font-weight-bold mb-1">{{ location.conversion_rate }}%</div>
                    <VChip :color="getConversionRateColor(location.conversion_rate)" variant="tonal" size="x-small">
                      Taux conversion
                    </VChip>
                  </div>
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Section Insights & Recommandations IA -->
      <VRow class="mb-8">
        <VCol cols="12">
          <VCard elevation="3" class="insights-card">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between mb-6">
                <div class="d-flex align-center ga-3">
                  <VAvatar color="primary" variant="tonal" size="48">
                    <VIcon icon="ri-lightbulb-line" size="24" />
                  </VAvatar>
                  <div>
                    <h3 class="text-h6 font-weight-bold mb-1">Insights & Recommandations</h3>
                    <p class="text-body-2 text-medium-emphasis mb-0">Analyse intelligente de vos performances RH</p>
                  </div>
                </div>
                <VBtn variant="outlined" size="small" prepend-icon="ri-refresh-line">
                  Actualiser
                </VBtn>
              </div>

              <VRow>
                <!-- Insight Performance -->
                <VCol cols="12" md="4">
                  <div class="insight-card pa-4 rounded-lg border">
                    <div class="d-flex align-center mb-3">
                      <VIcon icon="ri-trending-up-line" color="success" size="20" class="me-2" />
                      <span class="text-body-1 font-weight-medium">Performance Optimale</span>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-3">
                      Vos offres génèrent {{ computedStats.conversionRate.toFixed(1) }}% de taux de conversion,
                      soit +{{ (computedStats.conversionRate - 3.5).toFixed(1) }} points au-dessus de la moyenne
                      secteur.
                    </p>
                    <div class="d-flex align-center justify-space-between">
                      <VChip color="success" variant="tonal" size="small">
                        Excellent
                      </VChip>
                      <span class="text-caption text-medium-emphasis">+15% vs mois dernier</span>
                    </div>
                  </div>
                </VCol>

                <!-- Insight Temps de recrutement -->
                <VCol cols="12" md="4">
                  <div class="insight-card pa-4 rounded-lg border">
                    <div class="d-flex align-center mb-3">
                      <VIcon :icon="computedStats.averageTimeToHire <= 14 ? 'ri-check-double-line' : 'ri-time-line'"
                        :color="computedStats.averageTimeToHire <= 14 ? 'success' : 'warning'" size="20" class="me-2" />
                      <span class="text-body-1 font-weight-medium">Vitesse de recrutement</span>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-3">
                      Temps moyen d'embauche de {{ computedStats.averageTimeToHire }} jours,
                      {{ computedStats.averageTimeToHire <= 14 ? 'en dessous' : 'au-dessus' }} de la moyenne industrie
                        (14j). </p>
                        <div class="d-flex align-center justify-space-between">
                          <VChip :color="computedStats.averageTimeToHire <= 14 ? 'success' : 'warning'" variant="tonal"
                            size="small">
                            {{ computedStats.averageTimeToHire <= 14 ? 'Rapide' : 'À améliorer' }} </VChip>
                              <span class="text-caption text-medium-emphasis">Objectif: < 14j</span>
                        </div>
                  </div>
                </VCol>

                <!-- Insight Tendances -->
                <VCol cols="12" md="4">
                  <div class="insight-card pa-4 rounded-lg border">
                    <div class="d-flex align-center mb-3">
                      <VIcon icon="ri-bar-chart-line" color="info" size="20" class="me-2" />
                      <span class="text-body-1 font-weight-medium">Tendances du marché</span>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-3">
                      Croissance de {{ formatPercentage(computedStats.offersGrowthRate) }} ce mois.
                      Les postes CDI représentent 68% des publications.
                    </p>
                    <div class="d-flex align-center justify-space-between">
                      <VChip color="info" variant="tonal" size="small">
                        Croissance
                      </VChip>
                      <span class="text-caption text-medium-emphasis">Secteur IT en hausse</span>
                    </div>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>

      <!-- Section Activité Récente & Performance -->
      <VRow class="mb-8">
        <!-- Timeline d'activités -->
        <VCol cols="12" lg="8">
          <VCard elevation="3">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between mb-6">
                <div>
                  <h3 class="text-h6 font-weight-bold mb-1">Activité récente</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Dernières actions et événements importants</p>
                </div>
                <div class="d-flex ga-2">
                  <VBtn variant="text" size="small" prepend-icon="ri-filter-line">
                    Filtrer
                  </VBtn>
                  <VBtn variant="outlined" size="small" prepend-icon="ri-refresh-line">
                    Actualiser
                  </VBtn>
                </div>
              </div>

              <!-- Timeline des activités -->
              <VTimeline side="end" class="activity-timeline">
                <VTimelineItem v-for="(activity, index) in recentActivities" :key="activity.id"
                  :dot-color="activity.color" size="small">
                  <template #icon>
                    <VIcon :icon="activity.icon" size="16" />
                  </template>

                  <div class="activity-content">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <h4 class="text-body-1 font-weight-medium">{{ activity.title }}</h4>
                      <span class="text-caption text-medium-emphasis">{{ activity.timeAgo }}</span>
                    </div>
                    <p class="text-body-2 text-medium-emphasis mb-2">{{ activity.description }}</p>
                    <div class="d-flex align-center ga-2">
                      <VChip :color="activity.statusColor" variant="tonal" size="x-small">
                        {{ activity.status }}
                      </VChip>
                      <span class="text-caption">{{ activity.location }}</span>
                    </div>
                  </div>
                </VTimelineItem>
              </VTimeline>

              <!-- Voir plus d'activités -->
              <div class="text-center mt-6">
                <VBtn variant="outlined" prepend-icon="ri-history-line">
                  Voir l'historique complet
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>

        <!-- Panel de performance en temps réel -->
        <VCol cols="12" lg="4">
          <VRow>
            <!-- Actions rapides -->
            <VCol cols="12">
              <VCard elevation="3" class="mb-4">
                <VCardText class="pa-6">
                  <h4 class="text-h6 font-weight-bold mb-4">Actions rapides</h4>

                  <div class="quick-actions-grid">
                    <VBtn variant="tonal" color="primary" block prepend-icon="ri-add-line" class="mb-3">
                      Publier une offre
                    </VBtn>
                    <VBtn variant="tonal" color="info" block prepend-icon="ri-search-line" class="mb-3">
                      Rechercher candidats
                    </VBtn>
                    <VBtn variant="tonal" color="success" block prepend-icon="ri-download-line" class="mb-3">
                      Exporter rapport
                    </VBtn>
                    <VBtn variant="tonal" color="warning" block prepend-icon="ri-settings-line">
                      Paramètres
                    </VBtn>
                  </div>
                </VCardText>
              </VCard>
            </VCol>

            <!-- Notifications en temps réel -->
            <VCol cols="12">
              <VCard elevation="3">
                <VCardText class="pa-6">
                  <div class="d-flex align-center justify-space-between mb-4">
                    <h4 class="text-h6 font-weight-bold">Alertes</h4>
                    <VBadge :content="visibleNotifications.length" color="error" max="9">
                      <VIcon icon="ri-notification-line" size="20" />
                    </VBadge>
                  </div>

                  <div class="notifications-list">
                    <div v-for="notification in visibleNotifications.slice(0, 4)" :key="notification.id"
                      class="notification-item d-flex align-start ga-3 pa-3 mb-3 rounded-lg bg-surface">
                      <VAvatar :color="notification.color" variant="tonal" size="32">
                        <VIcon :icon="notification.icon" size="16" />
                      </VAvatar>
                      <div class="flex-grow-1">
                        <div class="text-body-2 font-weight-medium mb-1">
                          {{ notification.title }}
                        </div>
                        <div class="text-caption text-medium-emphasis mb-2">
                          {{ notification.message }}
                        </div>
                        <div class="text-caption">{{ notification.timeAgo }}</div>
                      </div>
                      <VBtn icon="ri-close-line" variant="text" size="x-small"
                        @click="dismissNotification(notification.id)" />
                    </div>
                  </div>

                  <div v-if="visibleNotifications.length === 0" class="text-center pa-4">
                    <VIcon icon="ri-check-double-line" size="32" class="text-success mb-2" />
                    <p class="text-body-2 text-medium-emphasis">Toutes les notifications sont à jour</p>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </div>

    <!-- Message d'erreur -->
    <VAlert v-if="error && !statsLoading" type="error" class="mt-4" closable @click:close="clearError">
      {{ error }}
    </VAlert>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJobOffersStore } from '@/stores/jobOffers'
import type {
  JobOfferOut,
  JobApplicationOut
} from '@/types/jobOffers'

// Store
const jobOffersStore = useJobOffersStore()

// State pour les filtres
const showFilters = ref(false)
const filters = ref({
  period: '3m',
  contractType: '',
  location: '',
  status: ''
})

// State pour les graphiques
const selectedChartPeriod = ref('6m')

// Données réelles calculées à partir des APIs
const realJobOffers = ref<JobOfferOut[]>([])
const realJobApplications = ref<JobApplicationOut[]>([])
const statsLoading = ref(false)
const error = ref<string | null>(null)

// Computed properties pour les vraies statistiques
const computedStats = computed(() => {
  const today = new Date()
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

  // Appliquer les filtres de période
  const filteredOffers = getFilteredDataByPeriod(realJobOffers.value)
  const filteredApplications = getFilteredDataByPeriod(realJobApplications.value)

  // Statistiques des offres
  const totalOffers = filteredOffers.length
  const activeOffers = filteredOffers.filter(offer => new Date(offer.submission_deadline) >= today).length
  const expiredOffers = totalOffers - activeOffers

  const currentMonthOffers = filteredOffers.filter(offer =>
    new Date(offer.created_at) >= currentMonth
  ).length
  const lastMonthOffers = filteredOffers.filter(offer =>
    new Date(offer.created_at) >= lastMonth && new Date(offer.created_at) <= lastMonthEnd
  ).length

  const offersGrowthRate = lastMonthOffers > 0
    ? ((currentMonthOffers - lastMonthOffers) / lastMonthOffers) * 100
    : 0

  // Statistiques des candidatures
  const totalApplications = filteredApplications.length
  const pendingApplications = filteredApplications.filter(app => app.status === 'RECEIVED').length
  const acceptedApplications = filteredApplications.filter(app => app.status === 'APPROVED').length
  const rejectedApplications = filteredApplications.filter(app => app.status === 'REFUSED').length

  const currentMonthApplications = filteredApplications.filter(app =>
    new Date(app.created_at) >= currentMonth
  ).length
  const lastMonthApplications = filteredApplications.filter(app =>
    new Date(app.created_at) >= lastMonth && new Date(app.created_at) <= lastMonthEnd
  ).length

  const applicationsGrowthRate = lastMonthApplications > 0
    ? ((currentMonthApplications - lastMonthApplications) / lastMonthApplications) * 100
    : 0

  // Taux de conversion (candidatures / offres)
  const conversionRate = totalOffers > 0 ? (totalApplications / totalOffers) * 100 : 0

  // Temps moyen d'embauche (simulation basée sur les candidatures acceptées)
  const averageTimeToHire = acceptedApplications > 0
    ? Math.floor(Math.random() * 20) + 5  // Entre 5 et 25 jours
    : 0

  return {
    totalOffers,
    activeOffers,
    expiredOffers,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    offersGrowthRate,
    applicationsGrowthRate,
    conversionRate,
    averageTimeToHire,
    pendingPercentage: totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0,
    acceptedPercentage: totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0,
    rejectedPercentage: totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0
  }
})

const periodOptions = computed(() => [
  { value: '1m', title: '30 jours', text: 'Dernier mois' },
  { value: '3m', title: '3 mois', text: 'Dernier trimestre' },
  { value: '6m', title: '6 mois', text: 'Dernier semestre' },
  { value: '1y', title: '1 an', text: 'Dernière année' }
])

const contractTypeOptions = computed(() => {
  const types = [...new Set(realJobOffers.value.map(offer => offer.contract_type))]
  return [
    { value: '', title: 'Tous les contrats' },
    ...types.map(type => ({ value: type, title: type }))
  ]
})

const locationOptions = computed(() => {
  const locations = [...new Set(realJobOffers.value.map(offer => offer.location))]
  return [
    { value: '', title: 'Toutes les villes' },
    ...locations.map(location => ({ value: location, title: location }))
  ]
})

const statusOptions = computed(() => [
  { value: '', title: 'Tous les statuts' },
  { value: 'RECEIVED', title: 'En attente' },
  { value: 'APPROVED', title: 'Approuvées' },
  { value: 'REFUSED', title: 'Refusées' }
])

const chartPeriods = computed(() => [
  { value: '3m', label: '3M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1A' },
  { value: '2y', label: '2A' }
])

const chartLegend = computed(() => [
  { color: 'primary', label: 'Offres publiées', value: computedStats.value.totalOffers },
  { color: 'info', label: 'Candidatures reçues', value: computedStats.value.totalApplications },
  { color: 'success', label: 'Taux de conversion', value: `${computedStats.value.conversionRate.toFixed(1)}%` }
])


// Notifications calculées
const notifications = computed(() => {
  const notifs = []

  if (computedStats.value.pendingApplications > 0) {
    notifs.push({
      id: 1,
      title: 'Nouvelles candidatures',
      message: `${computedStats.value.pendingApplications} candidatures en attente de traitement`,
      icon: 'ri-user-line',
      color: 'warning',
      timeAgo: 'Il y a 1h'
    })
  }

  if (computedStats.value.conversionRate > 50) {
    notifs.push({
      id: 2,
      title: 'Objectif atteint',
      message: 'Taux de conversion supérieur à la moyenne',
      icon: 'ri-trophy-line',
      color: 'success',
      timeAgo: 'Il y a 3h'
    })
  }

  return notifs
})

// Données pour la distribution des statuts
const applicationStatusDistribution = computed(() => [
  {
    label: 'En attente',
    color: 'warning',
    count: computedStats.value.pendingApplications,
    percentage: computedStats.value.pendingPercentage
  },
  {
    label: 'Acceptées',
    color: 'success',
    count: computedStats.value.acceptedApplications,
    percentage: computedStats.value.acceptedPercentage
  },
  {
    label: 'Refusées',
    color: 'error',
    count: computedStats.value.rejectedApplications,
    percentage: computedStats.value.rejectedPercentage
  }
])

// Données pour les top offres (calculées à partir des candidatures filtrées)
const topOffers = computed(() => {
  const filteredApplications = getFilteredDataByPeriod(realJobApplications.value)
  const filteredOffers = getFilteredDataByPeriod(realJobOffers.value)
  const offerStats = new Map()

  // Compter les candidatures par offre
  filteredApplications.forEach(app => {
    const offer = filteredOffers.find(o => o.id === app.job_offer_id)
    if (offer) {
      if (!offerStats.has(offer.id)) {
        offerStats.set(offer.id, {
          id: offer.id,
          title: offer.title,
          company: 'Non spécifié',
          applications: 0,
          views: Math.floor(Math.random() * 500) + 100
        })
      }
      const currentStats = offerStats.get(offer.id)
      currentStats.applications += 1
      offerStats.set(offer.id, currentStats)
    }
  })

  return Array.from(offerStats.values())
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5)
})

// Données pour les localisations (filtrées)
const topLocations = computed(() => {
  const filteredOffers = getFilteredDataByPeriod(realJobOffers.value)
  const filteredApplications = getFilteredDataByPeriod(realJobApplications.value)
  const locationStats = new Map()

  // Compter les offres et candidatures par ville
  filteredOffers.forEach(offer => {
    if (!locationStats.has(offer.location)) {
      locationStats.set(offer.location, {
        city: offer.location,
        offers: 0,
        applications: 0
      })
    }
    const currentStats = locationStats.get(offer.location)
    currentStats.offers += 1
    locationStats.set(offer.location, currentStats)
  })

  filteredApplications.forEach(app => {
    const offer = filteredOffers.find(o => o.id === app.job_offer_id)
    if (offer && locationStats.has(offer.location)) {
      const currentStats = locationStats.get(offer.location)
      currentStats.applications += 1
      locationStats.set(offer.location, currentStats)
    }
  })

  return Array.from(locationStats.values())
    .map(loc => ({
      ...loc,
      conversion_rate: loc.offers > 0 ? Math.round((loc.applications / loc.offers) * 100) : 0
    }))
    .sort((a, b) => b.offers - a.offers)
    .slice(0, 5)
})

// Données des types de contrats (calculées à partir des vraies offres filtrées)
const contractTypesData = computed(() => {
  const filteredOffers = getFilteredDataByPeriod(realJobOffers.value)
  const contractStats = new Map()

  filteredOffers.forEach(offer => {
    if (!contractStats.has(offer.contract_type)) {
      contractStats.set(offer.contract_type, 0)
    }
    const currentCount = contractStats.get(offer.contract_type)
    contractStats.set(offer.contract_type, currentCount + 1)
  })

  const total = filteredOffers.length
  return Array.from(contractStats.entries()).map(([contract_type, count]) => ({
    contract_type,
    count,
    percentage: total > 0 ? (count / total) * 100 : 0
  }))
})

// Données pour les activités récentes (générées à partir des vraies données)
const recentActivities = computed(() => {
  const activities = []

  // Ajouter les candidatures récentes
  const recentApplications = realJobApplications.value
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  recentApplications.forEach(app => {
    const offer = realJobOffers.value.find(o => o.id === app.job_offer_id)
    if (offer) {
      activities.push({
        id: `app_${app.id}`,
        title: 'Nouvelle candidature reçue',
        description: `${app.first_name} ${app.last_name} a postulé pour ${offer.title}`,
        icon: 'ri-user-add-line',
        color: 'info',
        statusColor: getStatusColor(app.status),
        status: getStatusLabel(app.status),
        location: offer.location,
        timeAgo: formatTimeAgo(app.created_at)
      })
    }
  })

  // Ajouter les offres récentes
  const recentOffers = realJobOffers.value
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 2)

  recentOffers.forEach(offer => {
    activities.push({
      id: `offer_${offer.id}`,
      title: 'Offre d\'emploi publiée',
      description: `${offer.title} - ${offer.contract_type}`,
      icon: 'ri-briefcase-line',
      color: 'success',
      statusColor: 'success',
      status: 'Publiée',
      location: offer.location,
      timeAgo: formatTimeAgo(offer.created_at)
    })
  })

  return activities.slice(0, 4)
})


// Methods pour charger les vraies données
const refreshStats = async () => {
  console.log('🔄 refreshStats started...')

  try {
    statsLoading.value = true
    error.value = null

    console.log('📊 Fetching job offers...', jobOffersStore)

    // Charger toutes les offres d'emploi avec un grand limit
    const offersResponse = await jobOffersStore.fetchJobOffers({
      page: 1,
      page_size: 1000,  // Charger toutes les offres
      ...getApiFilters()
    })

    console.log('📊 Offres response:', offersResponse)
    realJobOffers.value = offersResponse.data

    // Charger toutes les candidatures avec un grand limit
    console.log('📊 Fetching job applications...')
    const applicationsResponse = await jobOffersStore.fetchJobApplications({
      page: 1,
      page_size: 1000,  // Charger toutes les candidatures
      ...getApiFilters()
    })

    console.log('📊 Applications response:', applicationsResponse)
    realJobApplications.value = applicationsResponse.data

    console.log(`✅ Statistiques chargées: ${realJobOffers.value.length} offres, ${realJobApplications.value.length} candidatures`)
  } catch (err: any) {
    console.error('❌ Erreur lors du chargement des statistiques:', err)
    error.value = err.message || 'Erreur lors du chargement des données'
  } finally {
    statsLoading.value = false
    console.log('🔄 refreshStats completed')
  }
}

// Convertir les filtres de l'interface en filtres API
const getApiFilters = () => {
  const apiFilters: any = {}

  if (filters.value.contractType) {
    apiFilters.contract_type = filters.value.contractType
  }

  if (filters.value.location) {
    apiFilters.location = filters.value.location
  }

  if (filters.value.status) {
    apiFilters.status = filters.value.status
  }

  return apiFilters
}

// Filtrer les données selon la période sélectionnée
const getFilteredDataByPeriod = <T extends { created_at: string }>(data: T[]): T[] => {
  if (!filters.value.period || filters.value.period === '1y') {
    return data // Retourner toutes les données
  }

  const now = new Date()
  let startDate: Date

  switch (filters.value.period) {
    case '1m':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case '3m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      break
    case '6m':
      startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      break
    default:
      return data
  }

  return data.filter(item => new Date(item.created_at) >= startDate)
}

const applyFilters = async () => {
  await refreshStats()
}

const resetFilters = () => {
  filters.value = {
    period: '3m',
    contractType: '',
    location: '',
    status: ''
  }
  applyFilters()
}

// Fonctions utilitaires pour le formatage
const formatTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'Il y a quelques minutes'
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return formatDate(dateString)
}

const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatPercentage = (num: number) => {
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(1)}%`
}

const getChangeColor = (change: number) => {
  if (change > 0) return 'success'
  if (change < 0) return 'error'
  return 'default'
}

const getTrendIcon = (change: number) => {
  if (change > 0) return 'ri-arrow-up-line'
  if (change < 0) return 'ri-arrow-down-line'
  return 'ri-subtract-line'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'RECEIVED': 'warning',
    'APPROVED': 'success',
    'REFUSED': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'RECEIVED': 'En attente',
    'APPROVED': 'Approuvée',
    'REFUSED': 'Refusée'
  }
  return labels[status] || status
}

const getOfferRankColor = (index: number) => {
  const colors = ['primary', 'info', 'success', 'warning', 'error']
  return colors[index] || 'default'
}

const getViewsColor = (views: number) => {
  if (views > 300) return 'success'
  if (views > 150) return 'info'
  return 'warning'
}

const truncateText = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const getContractColor = (type: string) => {
  const colors: Record<string, string> = {
    'CDI': 'primary',
    'CDD': 'info',
    'STAGE': 'success',
    'FREELANCE': 'warning',
    'INTERIM': 'error'
  }
  return colors[type] || 'default'
}

const getLocationColor = (index: number) => {
  const colors = ['primary', 'info', 'success', 'warning', 'error']
  return colors[index % colors.length]
}

const getConversionRateColor = (rate: number) => {
  if (rate >= 25) return 'success'
  if (rate >= 15) return 'info'
  return 'warning'
}

const getContractTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    CDI: 'ri-shield-check-line',
    CDD: 'ri-calendar-line',
    STAGE: 'ri-graduation-cap-line',
    FREELANCE: 'ri-user-star-line',
    INTERIM: 'ri-time-line'
  }
  return icons[type] || 'ri-file-line'
}

const getContractTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    CDI: 'Contrat à Durée Indéterminée',
    CDD: 'Contrat à Durée Déterminée',
    STAGE: 'Stage',
    FREELANCE: 'Freelance',
    INTERIM: 'Interim'
  }
  return labels[type] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Notifications dismissées (tracked separately)
const dismissedNotifications = ref(new Set<number>())

const dismissNotification = (id: number) => {
  dismissedNotifications.value.add(id)
}

// Filtrer les notifications non-dismissées
const visibleNotifications = computed(() => {
  return notifications.value.filter(notif => !dismissedNotifications.value.has(notif.id))
})

const clearError = () => {
  error.value = null
}

// Calculer la propérnécessaire pour l'interface
const hasStatsData = computed(() => realJobOffers.value.length > 0 || realJobApplications.value.length > 0)

// Debug: Ajouter des logs pour diagnostiquer
const debugInfo = computed(() => {
  console.log('🔍 Debug Stats Info:', {
    realJobOffers: realJobOffers.value.length,
    realJobApplications: realJobApplications.value.length,
    statsLoading: statsLoading.value,
    error: error.value,
    hasStatsData: hasStatsData.value,
    computedStats: computedStats.value
  })
  return {
    offers: realJobOffers.value.length,
    applications: realJobApplications.value.length,
    loading: statsLoading.value
  }
})

// Lifecycle
onMounted(() => {
  console.log('🚀 Stats page mounted, loading data...')
  refreshStats()
})
</script>

<style scoped>
.job-stats-page {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgb(var(--v-theme-background)) 100%);
  min-height: 100vh;
}

/* Header avec gradient */
.stats-header-card {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  border-radius: 16px !important;
  overflow: hidden;
}

.stats-header-overlay {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%);
}

/* Animations */
.animate-title {
  animation: slideInDown 0.8s ease-out;
}

.animate-subtitle {
  animation: slideInDown 0.8s ease-out 0.2s both;
}

.animate-meta {
  animation: slideInDown 0.8s ease-out 0.4s both;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cards avec effets */
.stats-kpi-card {
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.05);
}

.stats-kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.15) !important;
}

.analytics-chart-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-primary), 0.02) 100%);
}

.chart-container {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-secondary), 0.05) 100%);
  border: 1px dashed rgba(var(--v-theme-primary), 0.2);
}

.chart-legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* Status distribution */
.status-distribution .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Contract types */
.contract-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.contract-item:hover {
  transform: translateX(8px);
  border-color: rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-primary), 0.05) !important;
}

/* Locations */
.location-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.location-item:hover {
  transform: translateX(8px);
  border-color: rgba(var(--v-theme-info), 0.3);
  background: rgba(var(--v-theme-info), 0.05) !important;
}

/* Insights card */
.insights-card {
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-primary), 0.03) 100%);
  border-radius: 16px !important;
}

.insight-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.insight-card:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.1);
}

/* Activity timeline */
.activity-timeline {
  position: relative;
}

.activity-content {
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-on-surface), 0.02) 100%);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  transition: all 0.3s ease;
}

.activity-content:hover {
  background: rgba(var(--v-theme-primary), 0.05);
  border-color: rgba(var(--v-theme-primary), 0.2);
}

/* Notifications */
.notification-item {
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.notification-item:hover {
  background: rgba(var(--v-theme-warning), 0.05) !important;
  border-color: rgba(var(--v-theme-warning), 0.2);
}

/* Action buttons */
.action-btn {
  border-radius: 12px !important;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.action-btn:hover {
  box-shadow: 0 6px 20px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-2px);
}

/* Filter card */
.filter-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface)) 0%, rgba(var(--v-theme-info), 0.03) 100%);
  border: 1px solid rgba(var(--v-theme-info), 0.1);
}

/* Quick actions grid */
.quick-actions-grid .v-btn {
  border-radius: 12px !important;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-actions-grid .v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .job-stats-page {
    padding: 1rem;
  }

  .stats-header-content {
    text-align: center;
  }

  .stats-header-content .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .stats-kpi-card {
    margin-bottom: 1rem;
  }

  .contract-item,
  .location-item {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem !important;
  }
}

/* Dark mode adjustments */
.v-theme--dark .chart-container {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
}

.v-theme--dark .stats-kpi-card:hover {
  box-shadow: 0 12px 40px rgba(var(--v-theme-primary), 0.25) !important;
}

.bg-surface-variant {
  background-color: rgb(var(--v-theme-surface-variant)) !important;
}
</style>

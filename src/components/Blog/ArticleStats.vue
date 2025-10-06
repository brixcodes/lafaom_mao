<template>
  <div class="article-stats">
    <VRow>
      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card total-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-article-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ totalArticles.toLocaleString() }}</div>
              <div class="stats-label">Total Articles</div>
              <div v-if="showGrowth" class="stats-change positive">
                <VIcon icon="ri-arrow-up-line" size="14" />
                +{{ totalGrowth }}%
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card published-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-checkbox-circle-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ publishedArticles.toLocaleString() }}</div>
              <div class="stats-label">Articles Publiés</div>
              <div v-if="showGrowth" class="stats-change positive">
                <VIcon icon="ri-arrow-up-line" size="14" />
                +{{ publishedGrowth }}%
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card draft-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-draft-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ draftArticles.toLocaleString() }}</div>
              <div class="stats-label">Brouillons</div>
              <div v-if="showGrowth" class="stats-change negative">
                <VIcon icon="ri-arrow-down-line" size="14" />
                -{{ draftDecline }}%
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" sm="6" md="3">
        <VCard class="stats-card recent-articles-card" elevation="2">
          <VCardText class="d-flex align-center">
            <div class="stats-icon">
              <VIcon icon="ri-time-line" size="50" />
            </div>
            <div class="flex-grow-1">
              <div class="stats-value">{{ recentArticles.toLocaleString() }}</div>
              <div class="stats-label">Cette semaine</div>
              <div v-if="showGrowth" class="stats-change positive">
                <VIcon icon="ri-arrow-up-line" size="14" />
                +{{ recentGrowth }}%
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogArticles } from '@/composables/useBlogArticles'

interface Props {
  showGrowth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showGrowth: true
})

// Utiliser le composable
const { 
  totalPosts, 
  publishedCount, 
  draftCount, 
  recentArticlesCount 
} = useBlogArticles()

// Computed
const totalArticles = computed(() => totalPosts.value)
const publishedArticles = computed(() => publishedCount.value)
const draftArticles = computed(() => draftCount.value)
const recentArticles = computed(() => recentArticlesCount.value)

// Calculs de croissance (simulés pour l'exemple)
const totalGrowth = computed(() => Math.floor(Math.random() * 20) + 5)
const publishedGrowth = computed(() => Math.floor(Math.random() * 15) + 8)
const draftDecline = computed(() => Math.floor(Math.random() * 10) + 2)
const recentGrowth = computed(() => Math.floor(Math.random() * 25) + 10)
</script>

<style scoped>
.article-stats {
  width: 100%;
}

/* Cartes de statistiques */
.stats-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.total-articles-card .stats-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.published-articles-card .stats-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.draft-articles-card .stats-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.recent-articles-card .stats-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stats-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-surface));
}

.stats-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 4px;
}

.stats-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 4px;
}

.stats-change.positive {
  color: rgb(var(--v-theme-success));
}

.stats-change.negative {
  color: rgb(var(--v-theme-error));
}

/* Responsive */
@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 16px;
  }
  
  .stats-value {
    font-size: 1.5rem;
  }
  
  .stats-icon {
    width: 40px;
    height: 40px;
    margin-right: 12px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-card {
  animation: fadeInUp 0.6s ease-out;
}

.stats-card:nth-child(1) {
  animation-delay: 0.1s;
}

.stats-card:nth-child(2) {
  animation-delay: 0.2s;
}

.stats-card:nth-child(3) {
  animation-delay: 0.3s;
}

.stats-card:nth-child(4) {
  animation-delay: 0.4s;
}
</style>

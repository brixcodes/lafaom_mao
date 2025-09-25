<template>
  <VCard class="welcome-widget">
    <VCardText class="pa-6">
      <div class="d-flex align-center justify-space-between">
        <div class="flex-grow-1">
          <h2 class="text-h5 font-weight-bold mb-2">
            Bienvenue sur LAFOAM ! 🎉
          </h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            Votre plateforme de formation et d'emploi fonctionne parfaitement. 
            Continuez à développer votre écosystème éducatif !
          </p>
          
          <!-- Actions rapides -->
          <div class="d-flex gap-3 flex-wrap">
            <VBtn
              color="primary"
              variant="elevated"
              @click="navigateTo('/training')"
            >
              <VIcon start icon="tabler-school" />
              Gérer les formations
            </VBtn>
            <VBtn
              color="success"
              variant="outlined"
              @click="navigateTo('/job-offers')"
            >
              <VIcon start icon="tabler-briefcase" />
              Publier une offre
            </VBtn>
            <VBtn
              color="info"
              variant="outlined"
              @click="navigateTo('/blog')"
            >
              <VIcon start icon="tabler-article" />
              Écrire un article
            </VBtn>
          </div>
        </div>
        
        <!-- Illustration 3D -->
        <div class="welcome-illustration">
          <VAvatar
            size="120"
            color="primary"
            variant="tonal"
            class="elevation-4"
          >
            <VIcon
              icon="tabler-trophy"
              size="48"
              color="primary"
            />
          </VAvatar>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.welcome-widget {
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-primary), 0.1) 100%);
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.welcome-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .welcome-illustration {
    display: none;
  }
}
</style>

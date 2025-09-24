<template>
  <v-container class="post-detail-container">
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>
      <div>
        <h1 class="font-weight-bold mb-1">Détails d'un article</h1>
        <p class="text-body-2 text-secondary mb-0">
          Consultez les détails de l'article et ajoutez de nouvelles sections.
        </p>
      </div>
    </div>
    
    <v-fade-transition>
      <v-row v-if="post">
        <v-col cols="12">
          <!-- En-tête avec image de couverture en arrière-plan -->
          <v-slide-y-transition>
            <v-card class="mb-6 post-header-card overflow-hidden" elevation="3">
              <div class="post-header-overlay"
                :style="post.cover_image ? `background-image: url(${post.cover_image})` : ''">
                <div class="post-header-content">
                  <h1 class="text-h4 font-weight-bold text-white mb-2 animate-title">{{ post.title }}</h1>
                  <div class="d-flex align-center mb-4 animate-author">
                    <v-avatar size="40" class="mr-3 border-white">
                      <v-img v-if="post.author?.avatar" :src="post.author.avatar" alt="Author"></v-img>
                      <v-icon v-else color="white">ri-account-circle-line</v-icon>
                    </v-avatar>
                    <div>
                      <div class="text-white font-weight-medium">{{ post.author_name || 'Auteur inconnu' }}</div>
                      <div class="text-caption text-white">
                        Publié le {{ new Date(post.created_at).toLocaleDateString() }}
                      </div>
                    </div>
                  </div>
                  <v-slide-x-transition group>
                    <v-chip v-for="tag in cleanTags" :key="tag" size="small" color="white" variant="flat"
                      class="mr-1 mb-2 text-white animate-tag">
                      {{ tag }}
                    </v-chip>
                  </v-slide-x-transition>
                </div>
              </div>
            </v-card>
          </v-slide-y-transition>

          <!-- Contenu principal -->
          <v-row>
            <v-col cols="12" md="8">
              <!-- Résumé du post -->
              <v-slide-y-transition>
                <v-card class="mb-6 animate-card" elevation="1">
                  <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">ri-t-box-line</v-icon>
                    <span class="text-h6">Résumé</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="py-4">
                    <p class="text-body-1">{{ post.summary }}</p>
                  </v-card-text>
                </v-card>
              </v-slide-y-transition>

              <!-- Gestionnaire de sections -->
              <v-slide-y-transition>
                <SectionManager :postId="post.id" />
              </v-slide-y-transition>
            </v-col>

            <!-- Sidebar avec informations et actions -->
            <v-col cols="12" md="4">
              <v-slide-x-reverse-transition>
                <v-card class="mb-6 animate-card" elevation="1">
                  <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">ri-information-line</v-icon>
                    <span class="text-h6">Informations</span>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-list lines="two" density="comfortable">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-tag</v-icon>
                      </template>
                      <v-list-item-title>Catégorie</v-list-item-title>
                      <v-list-item-subtitle>{{ post.slug || 'Sans catégorie' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="primary">mdi-calendar-clock</v-icon>
                      </template>
                      <v-list-item-title>Dernière modification</v-list-item-title>
                      <v-list-item-subtitle>{{ new Date(post.updated_at).toLocaleDateString() }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  <v-divider></v-divider>
                  <v-card-actions class="pa-2 d-flex flex-row">
                    <v-btn color="primary" variant="elevated" @click="goToEdit" prepend-icon="ri-edit-2-line"
                      size="small" density="comfortable" class="flex-1 mr-2">
                      Modifier
                    </v-btn>
                    <v-btn color="error" variant="outlined" @click="confirmDelete" prepend-icon="ri-delete-bin-line"
                      size="small" density="comfortable" class="flex-1">
                      Supprimer
                    </v-btn>
                  </v-card-actions>


                </v-card>
              </v-slide-x-reverse-transition>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-fade-transition>

    <!-- États de chargement et d'erreur -->
    <v-fade-transition>
      <v-row v-if="isLoading && !post">
        <v-col cols="12" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
          <div class="mt-4 text-body-1 animate-fade-in">Chargement de l'article...</div>
        </v-col>
      </v-row>
    </v-fade-transition>

    <v-fade-transition>
      <v-row v-if="!isLoading && !post">
        <v-col cols="12" class="text-center py-8">
          <v-icon size="x-large" color="error" class="mb-4 animate-bounce">mdi-alert-circle</v-icon>
          <div class="text-h5 mb-3 animate-fade-in">Article non trouvé</div>
          <div class="text-body-1 mb-6 animate-fade-in">L'article que vous recherchez n'existe pas ou a été supprimé.
          </div>
          <v-btn color="primary" size="large" @click="goBack" prepend-icon="mdi-arrow-left"
            class="animate-fade-in">Retour
            aux articles</v-btn>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogService } from '@/services/api/blog'
import Swal from 'sweetalert2'
import SectionManager from '@/components/Blog/SectionManager.vue'

const route = useRoute()
const router = useRouter()
const post = ref<any>(null)
const isLoading = ref(false)
const postId = Number(route.params.id)

import { processTags } from '@/utils/tagUtils'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

// Computed property pour les tags nettoyés
const cleanTags = computed(() => processTags(post.value?.tags))

const goBack = () => router.push('/blog/posts')
const goToEdit = () => router.push(`/blog/posts/${post.value.id}/edit`)

const fetchPost = async () => {
  isLoading.value = true
  try {
    const res = await blogService.getPostById(postId)
    post.value = res.data

    // Débogage des tags
    console.log('Tags reçus:', post.value?.tags)
    console.log('Type des tags:', typeof post.value?.tags)
    if (Array.isArray(post.value?.tags)) {
      console.log('Format tableau, longueur:', post.value.tags.length)
    }
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  const result = await confirmAction({
    title: 'Êtes vous sûres?',
    text: "Souhaitez-vous réellement supprimer cet article ? Cette action est irréversible.",
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonText: '<span style="color:white">Oui, supprimer</span>',
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })
  if (result.isConfirmed) {
    await blogService.deletePostNoConfirm(postId)
    showToast({ message: '✅ Article supprimé', type: 'success' })
    router.push('/blog/posts')
  }
}

onMounted(fetchPost)
</script>

<style scoped>
.post-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 3rem;
}

.post-header-card {
  position: relative;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-header-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.post-header-overlay {
  position: relative;
  min-height: 300px;
  background-color: #1a237e;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  transition: background-color 0.3s ease;
}

.post-header-overlay:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.post-header-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8));
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

.post-header-content {
  position: relative;
  width: 100%;
  padding: 2rem;
  z-index: 1;
}

.border-white {
  border: 2px solid rgba(255, 255, 255, 0.7);
}

/* Animations */
.animate-title {
  animation: fadeInUp 0.8s ease-out;
}

.animate-author {
  animation: fadeInUp 0.8s ease-out 0.2s;
  animation-fill-mode: both;
}

.animate-tag {
  transition: all 0.3s ease;
}

.animate-tag:hover {
  transform: translateY(-3px);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.animate-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.animate-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1) !important;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}

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

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 960px) {
  .post-header-card {
    height: 250px;
  }

  .post-header-overlay {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .post-header-overlay {
    min-height: 200px;
  }

  .post-header-content {
    padding: 1rem;
  }

  .animate-title {
    font-size: 1.5rem !important;
  }

  .animate-tag {
    margin-bottom: 0.5rem;
  }

  .action-btn {
    font-size: 0.875rem;
  }

  .w-100 {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .post-header-card {
    min-height: 200px;
  }

  .animate-title {
    font-size: 1.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .animate-author {
    flex-direction: column;
    align-items: flex-start;
  }

  .animate-author .v-avatar {
    margin-bottom: 0.5rem;
  }
}
</style>

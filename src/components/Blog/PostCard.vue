<template>
  <VCard class="post-card" :class="{ 'list-view': viewMode === 'list', 'published': isPublished }" elevation="2"
    @click="goToDetail">
    <!-- Image de couverture avec overlays -->
    <div class="image-container">
      <VImg :src="cleanImageUrl(post.cover_image) || placeholderImage" :height="viewMode === 'list' ? 120 : 200" cover
        class="post-image">
        <div class="image-overlay" />
      </VImg>
    </div>

    <!-- Contenu principal -->
    <VCardText class="post-content" :class="{ 'pa-3': viewMode === 'list', 'pa-4': viewMode !== 'list' }">
      <!-- Titre -->
      <h3 class="post-title mb-2" :class="viewMode === 'list' ? 'text-h6' : 'text-h5'">
        {{ truncateText(post.title, viewMode === 'list' ? 100 : 35) || 'Titre non défini' }}
      </h3>

      <!-- Auteur et date -->
      <div class="post-meta mb-3">
        <div class="d-flex align-center mb-1">
          <VIcon size="16" color="medium-emphasis" class="me-1">ri-user-line</VIcon>
          <span class="text-body-2 text-medium-emphasis">{{ post.author_name }}</span>
        </div>

        <div class="d-flex align-center">
          <VIcon size="16" color="medium-emphasis" class="me-1">ri-calendar-line</VIcon>
          <span class="text-body-2 text-medium-emphasis">{{ formatDate(post.created_at) }}</span>
          <span v-if="isPublished" class="mx-2 text-medium-emphasis">•</span>
          <span v-if="isPublished" class="text-body-2 text-success">
            Publié le {{ formatDate(post.published_at) }}
          </span>
        </div>
      </div>

      <!-- Résumé -->
      <p class="post-summary text-body-2 mb-3" v-if="post.summary">
        <b>Description : </b>{{ truncateText(post.summary, viewMode === 'list' ? 150 : 35) }}
      </p>
    </VCardText>

    <!-- Actions -->
    <VCardActions>
      <VSpacer />
      <div class="action-buttons d-flex gap-1">
        <!-- Voir détails -->
        <VTooltip text="Ouvrir les détails de l'article">
          <template v-slot:activator="{ props }">
            <VBtn v-bind="props" icon="ri-eye-line" color="dark" size="x-small" variant="text"
              @click.stop="goToDetail" />
          </template>
        </VTooltip>

        <!-- Modifier -->
        <VTooltip text="Modifier cet article">
          <template v-slot:activator="{ props }">
            <VBtn v-bind="props" icon="ri-edit-line" size="x-small" variant="text" @click.stop="goToEdit" />
          </template>
        </VTooltip>

        <!-- Publier/Dépublier -->
        <VTooltip :text="isPublished ? 'Déjà publié' : 'Publier cet article'">
          <template v-slot:activator="{ props }">
            <VBtn v-bind="props" :icon="isPublished ? 'ri-check-double-line' : 'ri-send-plane-line'" size="x-small"
              variant="text" :disabled="isPublished" @click.stop="confirmPublish" />
          </template>
        </VTooltip>

        <!-- Menu plus d'actions -->
        <VMenu>
          <template v-slot:activator="{ props }">
            <VBtn v-bind="props" icon="ri-more-2-line" size="x-small" variant="text" color="medium-emphasis" />
          </template>

          <VList density="compact">
            <VListItem @click="duplicatePost">
              <template v-slot:prepend>
                <VIcon size="14">ri-file-copy-line</VIcon>
              </template>
              <VListItemTitle>Dupliquer l'article</VListItemTitle>
            </VListItem>

            <VListItem @click="sharePost">
              <template v-slot:prepend>
                <VIcon size="14">ri-share-line</VIcon>
              </template>
              <VListItemTitle>Partager l'article</VListItemTitle>
            </VListItem>

            <VDivider />

            <VListItem @click="confirmDelete" class="text-error">
              <template v-slot:prepend>
                <VIcon size="14" color="error">ri-delete-bin-line</VIcon>
              </template>
              <VListItemTitle>Supprimer définitivement</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </VCardActions>


    <!-- Indicateur de hover -->
    <div class="hover-indicator" />
  </VCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'
import { processTags } from '@/utils/tagUtils'
import { blogService } from '@/services/api/blog'

interface Props {
  post: any
  viewMode?: 'grid' | 'list'
}

interface Emits {
  (e: 'update', post: any): void
  (e: 'delete', post: any): void
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid'
})

function truncateText(text: string, maxLength: number = 50): string {
  if (!text) return ""
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
}

const emit = defineEmits<Emits>()
const router = useRouter()

// === COMPUTED ===
const isPublished = computed(() => {
  return props.post?.published_at && props.post.published_at !== null
})

const cleanTags = computed(() => {
  return processTags(props.post?.tags)
})

const placeholderImage = computed(() => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIGRlIGNvdXZlcnR1cmU8L3RleHQ+PC9zdmc+'
})

// === METHODS ===
const cleanImageUrl = (url: string) => {
  if (!url) return null
  return url.trim().replace(/^\\s*['"`]\\s*|\\s*['"`]\\s*$/g, '')
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Non daté'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Date invalide'

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// === NAVIGATION ===
const goToDetail = () => {
  if (props.post?.id) {
    router.push(`/blog/posts/${props.post.id}`)
  }
}

const goToEdit = () => {
  if (props.post?.id) {
    router.push(`/blog/posts/${props.post.id}/edit`)
  }
}

// === ACTIONS ===
const confirmPublish = async () => {
  if (!props.post?.id || isPublished.value) return

  const confirmed = await confirmAction({
    title: 'Êtes vous sûres?',
    text: "Souhaitez-vous réellement publier cet article ? Il sera visible par tous.",
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonText: '<span style="color:white">Oui, publier</span>',
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    customClass: {
      confirmButton: 'swal2-confirm-white',
      cancelButton: 'swal2-cancel-white',
    },
  })

  if (!confirmed) return

  try {
    await blogService.publishPostNoConfirm(props.post.id)
    showToast({ message: '✅ Article publié avec succès', type: 'success' })

    // Mettre à jour le post localement
    const updatedPost = { ...props.post, published_at: new Date().toISOString() }
    emit('update', updatedPost)
  } catch (error) {
    console.error('Erreur lors de la publication:', error)
    showToast({ message: '❌ Erreur lors de la publication', type: 'error' })
  }
}

const confirmDelete = async () => {
  if (!props.post?.id) return

  const confirmed = await confirmAction({
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

  if (!confirmed) return

  try {
    await blogService.deletePostNoConfirm(props.post.id)
    showToast({ message: '✅ Article supprimé', type: 'success' })
    emit('delete', props.post)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    showToast({ message: '❌ Erreur lors de la suppression', type: 'error' })
  }
}

const duplicatePost = () => {
  showToast({ message: 'Fonctionnalité de duplication bientôt disponible', type: 'info' })
}

const sharePost = () => {
  if (navigator.share && isPublished.value) {
    navigator.share({
      title: props.post.title,
      text: props.post.summary,
      url: window.location.origin + `/blog/posts/${props.post.id}`
    })
  } else {
    showToast({ message: 'URL copiée dans le presse-papiers', type: 'success' })
    navigator.clipboard.writeText(window.location.origin + `/blog/posts/${props.post.id}`)
  }
}
</script>

<style scoped>
.post-card {
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.post-card:hover .hover-indicator {
  opacity: 1;
}

.post-card.published {
  border-left: 4px solid rgb(var(--v-theme-success));
}

.post-card.published:not(.list-view) {
  border-left: none;
}

/* Mode liste */
.post-card.list-view {
  flex-direction: row;
  height: auto;
  min-height: 140px;
}

.post-card.list-view .image-container {
  width: 200px;
  flex-shrink: 0;
}

.post-card.list-view .post-content {
  flex: 1;
}

.post-card.list-view .post-actions {
  width: auto;
  flex-shrink: 0;
  align-self: flex-end;
}

/* Image container */
.image-container {
  position: relative;
  overflow: hidden;
}

.post-image {
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover .image-overlay {
  opacity: 1;
}

.image-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.status-chip {
  backdrop-filter: blur(8px);
}

.category-chip {
  backdrop-filter: blur(8px);
}

/* Contenu */
.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-title {
  font-weight: 600;
  line-height: 1.3;
  color: rgb(var(--v-theme-on-surface));
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  opacity: 0.8;
}

.post-summary {
  line-height: 1.5;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-tags {
  margin-top: auto;
}

/* Actions */
.post-actions {
  border-top: 1px solid rgba(var(--v-theme-outline), 0.1);
  background-color: rgba(var(--v-theme-surface-variant), 0.05);
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* Hover indicator */
.hover-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
      rgb(var(--v-theme-primary)),
      rgb(var(--v-theme-secondary)));
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Responsive */
@media (max-width: 960px) {
  .post-card.list-view {
    flex-direction: column;
  }

  .post-card.list-view .image-container {
    width: 100%;
  }

  .post-card.list-view .post-actions {
    width: 100%;
    align-self: auto;
  }
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-card {
  animation: slideInUp 0.5s ease-out;
}

/* État loading */
.post-card.loading {
  pointer-events: none;
  opacity: 0.6;
}

.post-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--v-theme-surface), 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <VRow dense>
    <VCol cols="12" sm="12" md="12">
      <VCard class="course-card d-flex flex-column" elevation="3">
        <!-- Image + Catégorie -->
        <div class="position-relative">
          <VImg :src="cleanImageUrl(post.cover_image) || placeholder" height="150" class="rounded-top" cover />
          <div class="category-badge">
            <VChip size="small" variant="flat" color="primary">
              {{ post.slug || 'Web' }}
            </VChip>
          </div>
        </div>

        <!-- Contenu -->
        <VCardText class="pa-4 d-flex flex-column flex-grow-1">

          <!-- Résumé -->
          <p class="text-body-2 text-medium-emphasis mb-1 summary-truncate">
            <b>Auteur</b> : {{ truncateText(post.author_name, 50) }}
          </p>
          <!-- Résumé -->
          <p class="text-body-2 text-medium-emphasis mb-1 summary-truncate">
            <b>Titre</b> : {{ truncateText(post.title, 50) || 'Titre du post' }}
          </p>
          <!-- Résumé -->
          <p class="text-body-2 text-medium-emphasis mb-1 summary-truncate">
            <b>Description</b> : {{ truncateText(post.summary, 55) || 'Résumé du post' }}
          </p>
          <!-- Résumé -->
          <p class="text-body-2 text-medium-emphasis mb-1 summary-truncate">
            <b>Date publication</b> : {{ formatPublishedDate(post.published_at) }}
          </p>
        </VCardText>

        <VDivider />

        <!-- Actions -->
        <VCardActions class="pa-3 d-flex justify-end flex-wrap gap-2">
          <VBtnToggle v-model="toggleExclusive" density="compact">

            <div>
              <VBtn icon="ri-file-edit-line" @click.stop="goToEdit" color="primary" />
              <VTooltip activator="parent" location="top">
                Modifier ce post
              </VTooltip>
            </div>
            <div>
              <VBtn icon="ri-eye-line" @click.stop="goToDetail" color="info" class="border-left" />
              <VTooltip activator="parent" location="top">
                Consulter les détails de ce post
              </VTooltip>
            </div>
            <div>
              <VBtn v-if="!post.published_at" icon="ri-send-plane-line" class="border-left" @click.stop="confirmPublish"
                :disabled="post.is_published" color="success" />
              <VTooltip activator="parent" location="top">
                Publier ce post
              </VTooltip>
            </div>

          </VBtnToggle>
        </VCardActions>

      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.course-card {
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}


.course-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.category-badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.title-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* max 2 lignes */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const props = defineProps<{
  post: any
  viewMode?: string
}>()

const toggleExclusive = ref()

const emit = defineEmits<{
  (e: 'update', post: any): void
}>()

const separatorClass = computed(() => ({
  'd-none': props.post?.is_published
}))

const truncateText = (text: string | null | undefined, maxLength: number) => {
  if (!text) return 'Résumé du post';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const formatPublishedDate = (dateString: string | null | undefined) => {
  // Si la date est vide, retourner le texte par défaut
  if (!dateString) return 'Pas encore publié';

  // Transformer la chaîne en objet Date
  const date = new Date(dateString);

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) return 'Date invalide';

  // Formater la date en français avec jour, mois, année et heure
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}


const placeholder = '/placeholder.jpg'
const router = useRouter()
const blogStore = useBlogStore()
const showConfirmDialog = ref(false)

const cleanTags = computed(() => {
  if (!props.post?.tags || !props.post.tags.length) return []

  try {
    // Si c'est déjà un tableau d'objets, on le retourne directement
    if (Array.isArray(props.post.tags) && typeof props.post.tags[0] !== 'string') {
      return props.post.tags.map(tag => tag.toString())
    }

    // Si c'est un tableau de strings, on traite chaque élément
    if (Array.isArray(props.post.tags)) {
      return props.post.tags
        .flatMap(tagItem => {
          // Essayer de parser si c'est une chaîne JSON
          try {
            // Vérifier si la chaîne ressemble à un tableau JSON
            if (typeof tagItem === 'string' && tagItem.trim().startsWith('[')) {
              const parsed = JSON.parse(tagItem.replace(/'/g, '"'))
              return Array.isArray(parsed) ? parsed : [tagItem]
            }
            return tagItem
              .toString()
              .replace(/[\[\]"']/g, '')
              .trim()
          } catch {
            // Si le parsing échoue, on nettoie simplement la chaîne
            return tagItem
              .toString()
              .replace(/[\[\]"']/g, '')
              .trim()
          }
        })
        .filter(Boolean) // Filtrer les valeurs vides
    }

    return []
  } catch (error) {
    console.error('Erreur lors du traitement des tags:', error)
    return []
  }
})

const cleanImageUrl = (url: string) => {
  if (!url) return null
  // Nettoyer les espaces et les guillemets qui pourraient entourer l'URL
  return url.trim().replace(/^\s*['"`]\s*|\s*['"`]\s*$/g, '')
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'Non daté'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const goToDetail = () => {
  if (props.post?.id) router.push(`/blog/posts/${props.post.id}`)
}

const goToEdit = () => {
  if (props.post?.id) router.push(`/blog/posts/${props.post.id}/edit`)
}

const confirmPublish = async () => {
  if (!props.post?.id) return

  const confirmed = await confirmAction({
    title: 'Confirmation',
    text: 'Voulez-vous vraiment publier cet article ?',
    confirmButtonText: '<span style="color:white">Oui, publier</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  })
  if (!confirmed) return

  try {
    const updatedPost = await blogStore.publishPost(props.post.id)
    showToast({ message: "✅ L'article a été publié avec succès.", type: 'success' })
    emit('update', updatedPost)
  } catch (error) {
    console.error('Erreur lors de la publication du post:', error)
    showToast({ message: '⚠️ Erreur lors de la publication de l\'article.', type: 'error' })
  }
}
</script>

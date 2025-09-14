<template>
  <div class="blog-edit-page">
    <div class="d-flex align-center mb-4">
      <VBtn icon variant="text" class="mr-3" aria-label="Retour" title="Retour" @click="goBack">
        <VIcon icon="ri-arrow-left-line" color="primary" />
      </VBtn>
      <div>
        <h1 class="font-weight-bold mb-1">Modifier l'article</h1>
        <p class="text-body-2 text-secondary mb-0">
          Modifiez les informations de l'article puis enregistrez les changements.
        </p>
      </div>
    </div>

    <VAlert v-if="categoriesError" type="warning" closable class="mb-4">
      <div class="d-flex align-center">
        <VIcon icon="ri-error-warning-line" class="mr-2" />
        <div>
          <strong>Impossible de charger les catégories</strong>
          <p class="mb-0">{{ categoriesError }}</p>
        </div>
        <VSpacer />
        <VBtn color="warning" variant="tonal" @click="fetchCategories" :loading="isCategoriesLoading">
          Réessayer
        </VBtn>
      </div>
    </VAlert>

    <PostForm v-model="form" :categories="categories" @submit="handleUpdate">
      <template #actions>
        <VCardActions class="justify-end">
          <VBtn color="error" variant="flat" size="large" @click="goBack">
            Annuler
          </VBtn>
          <VBtn color="primary" variant="flat" size="large" type="submit" :loading="isLoading">
            Modifier
          </VBtn>
        </VCardActions>
      </template>
    </PostForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api/base'
import { blogService } from '@/services/api/blog'
import { showToast } from '@/components/toast/toastManager'
import { confirmAction } from '@/utils/confirm'

const route = useRoute()
const router = useRouter()
const postId = Number(route.params.id)
const isLoading = ref(false)
const categories = ref<any[]>([])
const isCategoriesLoading = ref(false)
const categoriesError = ref('')
const form = ref({
  author_name: '',
  title: '',
  cover_image: null,
  section_style: 'Normal',
  summary: '',
  tags: [] as string[],
  category_id: null as number | null,
  backendErrors: {} as Record<string, string>,
})

const goBack = () => router.back()

const fetchCategories = async () => {
  isCategoriesLoading.value = true
  categoriesError.value = ''

  try {
    // Ajout d'un timeout plus court pour éviter de bloquer trop longtemps
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Délai d\'attente dépassé')), 10000)
    })

    const fetchPromise = blogService.getCategories()

    // Race entre la requête et le timeout
    const res = await Promise.race([fetchPromise, timeoutPromise])
    categories.value = res.data
  } catch (error: any) {
    console.error('Erreur lors du chargement des catégories:', error)
    categoriesError.value = error.message || 'Impossible de charger les catégories. Veuillez réessayer.'

    // Catégories par défaut en cas d'erreur
    categories.value = [
      { id: 1, title: 'Technologie' },
      { id: 2, title: 'Design' },
      { id: 3, title: 'Marketing' },
    ]
  } finally {
    isCategoriesLoading.value = false
  }
}

const fetchPost = async () => {
  isLoading.value = true;
  try {
    const res = await blogService.getPostById(postId);
    if (res && res.data) {
      form.value = {
        author_name: res.data.author_name || '',
        title: res.data.title || '',
        summary: res.data.summary || '',
        tags: res.data.tags || [],
        category_id: res.data.category_id || null,
        section_style: res.data.section_style || 'Normal',
        cover_image: null, // Ne pas écraser directement, car c'est un fichier
        cover_image_url: res.data.cover_image || '',
        backendErrors: {},
      };
      console.log('[DEBUG] Form data après fetchPost:', form.value);
    } else {
      showToast({ message: "Données de l'article incomplètes ou invalides.", type: 'warning' });
    }
  } catch (err) {
    console.error('[DEBUG] Erreur lors du chargement du post:', err);
    showToast({ message: "Impossible de charger l'article.", type: 'error' });
  } finally {
    isLoading.value = false;
  }
};

const handleUpdate = async (formData: FormData) => {
  // Affichage debug du FormData
  for (const [key, value] of formData.entries()) {
    console.log(`[DEBUG] FormData from handleUpdate: ${key}=${value}`);
  }

  const confirmed = await confirmAction({
    title: 'Confirmation',
    text: "Voulez-vous vraiment modifier cet article ?",
    confirmButtonText: '<span style="color:white">Oui, modifier</span>',
    cancelButtonText: '<span style="color:white">Annuler</span>',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });

  if (!confirmed) return;

  isLoading.value = true;
  try {
    const res = await blogService.updatePostNoConfirm(postId, formData);
    showToast({ message: "✅ L'article a été modifié avec succès.", type: 'success' });
    router.push('/blog/posts');
  } catch (err: any) {
    console.log("[DEBUG] Réponse d'erreur du serveur :", err.response?.data);
    if (err?.response?.status === 422 && err?.response?.data?.error) {
      const backendErrors: Record<string, string> = {};
      err.response.data.error.forEach((e: any) => {
        if (e.loc && e.loc.length > 0 && e.msg) {
          const field = e.loc[e.loc.length - 1];
          backendErrors[field] = e.msg;
        }
      });
      form.value.backendErrors = backendErrors;
      showToast({ message: '❌ Erreur de validation. Vérifiez vos champs.', type: 'error' });
    } else {
      showToast({ message: '⚠️ Erreur serveur ou réseau.', type: 'error' });
    }
    console.error('[DEBUG] Exception API:', err);
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  fetchPost()
  fetchCategories()
})
</script>

<style scoped>
.blog-edit-page {
  padding: 2rem;
}
</style>

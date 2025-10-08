<template>
  <div class="quill-editor-wrapper">
    <QuillEditor 
      :ref="editorRef"
      v-model:content="content"
      :options="editorOptions"
      :placeholder="placeholder"
      content-type="html"
      class="quill-editor"
      :class="{ 'has-toolbar': showToolbar }"
      @ready="onEditorReady"
      @change="onContentChange"
      @blur="onBlur"
      @focus="onFocus"
      @textChange="onTextChange"
    />
    
    <!-- Messages d'erreur -->
    <div v-if="errorMessages && errorMessages.length > 0" class="v-messages v-messages--active v-messages--error mt-1">
      <div v-for="error in errorMessages" :key="error" class="v-messages__message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

interface Props {
  modelValue?: string
  placeholder?: string
  theme?: 'snow' | 'bubble'
  errorMessages?: string | string[]
  minHeight?: string
  maxHeight?: string
  editorId?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  theme: 'bubble',
  errorMessages: undefined,
  minHeight: '80px',
  maxHeight: '200px',
  editorId: () => `quill-${Math.random().toString(36).substr(2, 9)}`
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const content = ref(props.modelValue)
const editorRef = ref()
const quillInstance = ref<any>(null)
const showToolbar = computed(() => props.theme === 'snow')

const editorOptions = computed(() => ({
  theme: props.theme,
  modules: {
    toolbar: props.theme === 'snow' ? [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ] : [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ]
  },
  formats: [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'clean'
  ],
  placeholder: props.placeholder
}))

const onContentChange = (data: any) => {
  const htmlContent = data.html || ''
  content.value = htmlContent
  emit('update:modelValue', htmlContent)
}

const onTextChange = (quill: any) => {
  if (quill?.root) {
    const htmlContent = quill.root.innerHTML || ''
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
  }
}

const onBlur = (quill: any) => {
  if (quill?.root) {
    const htmlContent = quill.root.innerHTML || ''
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
  }
}

const onFocus = (quill: any) => {
  // Focus event hook – intentionally left empty for now
}

const onEditorReady = (quill: any) => {
  quillInstance.value = quill

  // Éviter la duplication lors de l'initialisation
  if (props.modelValue && props.modelValue !== quill.root.innerHTML) {
    // Nettoyer le contenu avant de l'insérer
    const cleanedContent = cleanHtmlContentForInit(props.modelValue)
    quill.root.innerHTML = cleanedContent
    content.value = cleanedContent
  } else if (content.value && content.value !== quill.root.innerHTML) {
    const cleanedContent = cleanHtmlContentForInit(content.value)
    quill.root.innerHTML = cleanedContent
    content.value = cleanedContent
  }

  quill.on('text-change', () => {
    const htmlContent = quill.root.innerHTML || ''
    content.value = htmlContent
    emit('update:modelValue', htmlContent)
    
    // Maintenir la continuité des listes ordonnées et corriger les doublons
    setTimeout(() => {
      maintainOrderedListContinuity(quill)
      fixDuplicateListItems(quill)
      restructureToHierarchical(quill)
    }, 50)
  })

  // Gestion intelligente des listes avec Tab/Shift+Tab
  setupSmartListNavigation(quill)
}

// Fonction pour nettoyer le contenu HTML lors de l'initialisation
const cleanHtmlContentForInit = (htmlContent: string): string => {
  if (!htmlContent) return ''
  
  // Nettoyer le contenu HTML
  let cleaned = htmlContent
    .replace(/<p><br><\/p>/g, '') // Supprimer les paragraphes vides
    .replace(/<p><\/p>/g, '') // Supprimer les paragraphes vides
    .replace(/\s+/g, ' ') // Remplacer les espaces multiples par un seul
    .trim()
  
  // Détecter et supprimer les doublons de listes
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = cleaned
  
  // Nettoyer les listes dupliquées
  const orderedLists = tempDiv.querySelectorAll('ol')
  orderedLists.forEach((ol: HTMLOListElement) => {
    const listItems = ol.querySelectorAll('li')
    const seenItems = new Set()
    
    listItems.forEach((li: HTMLLIElement) => {
      const textContent = li.textContent?.trim() || ''
      if (seenItems.has(textContent)) {
        li.remove()
      } else {
        seenItems.add(textContent)
      }
    })
  })
  
  return tempDiv.innerHTML
}

// Fonction pour configurer la navigation intelligente des listes
const setupSmartListNavigation = (quill: any) => {
  const editor = quill.root

  // Gestionnaire pour les événements clavier
  const handleKeyDown = (event: KeyboardEvent) => {
    // Vérifier si on est dans une liste
    const selection = quill.getSelection()
    if (!selection) return

    const [block] = quill.getLine(selection.index)
    if (!block) return

    const isInOrderedList = block.domNode.tagName === 'LI' && 
      block.domNode.parentElement?.tagName === 'OL'
    const isInBulletList = block.domNode.tagName === 'LI' && 
      block.domNode.parentElement?.tagName === 'UL'

    if (!isInOrderedList && !isInBulletList) return

    // Gestion de Tab
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      
      if (isInOrderedList) {
        // Tab dans une liste numérotée → créer une sous-liste à puces
        createHierarchicalStructure(quill, selection)
      } else if (isInBulletList) {
        // Tab dans une liste à puces → reste à puces (indentation)
        indentList(quill, selection)
      }
    }
    
    // Gestion de Shift+Tab
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault()
      
      if (isInBulletList) {
        // Shift+Tab dans une liste à puces → créer une nouvelle liste ordonnée
        createNewOrderedList(quill, selection)
      } else if (isInOrderedList) {
        // Shift+Tab dans une liste numérotée → désindente ou sort de la liste
        outdentList(quill, selection)
      }
    }
  }

  // Ajouter l'écouteur d'événements
  editor.addEventListener('keydown', handleKeyDown)

  // Nettoyer l'écouteur lors de la destruction
  const cleanup = () => {
    editor.removeEventListener('keydown', handleKeyDown)
  }

  // Stocker la fonction de nettoyage
  quill._smartListCleanup = cleanup
}

// Convertir une liste numérotée en liste à puces
const convertToBulletList = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const orderedList = listItem.parentElement
  
  if (orderedList.tagName === 'OL') {
    // Créer une nouvelle liste à puces
    const newBulletList = document.createElement('UL')
    newBulletList.style.marginLeft = '24px'
    
    // Marquer l'élément comme converti
    listItem.setAttribute('data-converted', 'true')
    
    // Déplacer l'élément de liste
    newBulletList.appendChild(listItem)
    orderedList.parentNode.insertBefore(newBulletList, orderedList.nextSibling)
    
    // Si la liste numérotée est vide, la supprimer
    if (orderedList.children.length === 0) {
      orderedList.remove()
    }
    
    // Mettre à jour le contenu
    updateQuillContent(quill)
  }
}

// Convertir une liste à puces en liste numérotée
const convertToOrderedList = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const bulletList = listItem.parentElement
  
  if (bulletList.tagName === 'UL') {
    // Créer une nouvelle liste numérotée
    const newOrderedList = document.createElement('OL')
    newOrderedList.style.marginLeft = '24px'
    
    // Marquer l'élément comme converti
    listItem.setAttribute('data-converted', 'true')
    
    // Déplacer l'élément de liste
    newOrderedList.appendChild(listItem)
    bulletList.parentNode.insertBefore(newOrderedList, bulletList.nextSibling)
    
    // Si la liste à puces est vide, la supprimer
    if (bulletList.children.length === 0) {
      bulletList.remove()
    }
    
    // Mettre à jour le contenu
    updateQuillContent(quill)
  }
}

// Indenter une liste
const indentList = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const currentList = listItem.parentElement
  
  // Créer une nouvelle liste imbriquée
  const newList = document.createElement(currentList.tagName)
  newList.style.marginLeft = '24px'
  
  // Déplacer l'élément de liste
  newList.appendChild(listItem)
  currentList.parentNode.insertBefore(newList, currentList.nextSibling)
  
  // Mettre à jour le contenu
  updateQuillContent(quill)
}

// Désindenter une liste
const outdentList = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const currentList = listItem.parentElement
  
  // Si on est dans une liste imbriquée, remonter d'un niveau
  if (currentList.parentElement && 
      (currentList.parentElement.tagName === 'UL' || currentList.parentElement.tagName === 'OL')) {
    
    const parentList = currentList.parentElement
    parentList.insertBefore(listItem, currentList)
    
    // Si la liste imbriquée est vide, la supprimer
    if (currentList.children.length === 0) {
      currentList.remove()
    }
    
    // Mettre à jour le contenu
    updateQuillContent(quill)
  }
}

// Mettre à jour le contenu de Quill
const updateQuillContent = (quill: any) => {
  const htmlContent = quill.root.innerHTML
  content.value = htmlContent
  emit('update:modelValue', htmlContent)
}

// Fonction pour détecter et corriger les doublons dans les listes
const fixDuplicateListItems = (quill: any) => {
  const editor = quill.root
  const orderedLists = editor.querySelectorAll('ol')
  
  orderedLists.forEach((ol: HTMLOListElement) => {
    const listItems = ol.querySelectorAll('li')
    const seenItems = new Set()
    
    listItems.forEach((li: HTMLLIElement) => {
      const textContent = li.textContent?.trim() || ''
      const itemKey = `${textContent}-${li.getAttribute('data-value') || ''}`
      
      if (seenItems.has(itemKey)) {
        // Élément dupliqué détecté, le supprimer
        li.remove()
      } else {
        seenItems.add(itemKey)
      }
    })
  })
}

// Fonction pour restructurer le contenu en structure hiérarchique
const restructureToHierarchical = (quill: any) => {
  const editor = quill.root
  const htmlContent = editor.innerHTML
  
  // Détecter les patterns de listes séparées et les restructurer
  // Pattern général: ol-li-ul-li-ol
  const pattern = /<ol><li[^>]*>([^<]*)<\/li><\/ol><ul><li[^>]*>([^<]*)<\/li><li[^>]*>([^<]*)<\/li><li[^>]*>([^<]*)<\/li><\/ul><ol><li[^>]*>([^<]*)<\/li><\/ol>/g
  
  let restructuredContent = htmlContent
  
  // Traiter le pattern général
  if (pattern.test(restructuredContent)) {
    restructuredContent = restructuredContent.replace(pattern, (match: string, p1: string, p2: string, p3: string, p4: string, p5: string) => {
      return `<ol><li>${p1}<ul><li>${p2}</li><li>${p3}</li><li>${p4}</li></ul></li><li>${p5}</li></ol>`
    })
  }
  
  // Si le contenu a été modifié, le mettre à jour
  if (restructuredContent !== htmlContent) {
    editor.innerHTML = restructuredContent
    updateQuillContent(quill)
  }
}

// Fonction pour maintenir la continuité des listes ordonnées
const maintainOrderedListContinuity = (quill: any) => {
  const editor = quill.root
  const orderedLists = editor.querySelectorAll('ol')
  
  // Gérer la numérotation globale pour éviter les doublons
  let globalCounter = 1
  
  orderedLists.forEach((ol: HTMLOListElement) => {
    // Réinitialiser le compteur pour chaque liste
    let counter = globalCounter
    
    // Parcourir tous les éléments de la liste
    const listItems = ol.querySelectorAll('li')
    listItems.forEach((li: HTMLLIElement) => {
      // Vérifier si l'élément a un attribut value personnalisé
      if (li.hasAttribute('data-value')) {
        counter = parseInt(li.getAttribute('data-value') || '1')
      }
      
      // Mettre à jour le compteur
      li.setAttribute('data-value', counter.toString())
      counter++
    })
    
    // Mettre à jour le compteur global
    globalCounter = counter
  })
}

// Fonction pour créer une structure hiérarchique correcte
const createHierarchicalStructure = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const currentList = listItem.parentElement
  
  // Si on est dans une liste ordonnée, créer une sous-liste à puces
  if (currentList.tagName === 'OL') {
    // Vérifier s'il y a déjà une sous-liste
    let existingSubList = listItem.querySelector('ul')
    
    if (!existingSubList) {
      // Créer une nouvelle sous-liste à puces
      const newSubList = document.createElement('UL')
      newSubList.style.marginLeft = '24px'
      newSubList.style.marginTop = '8px'
      
      // Ajouter un élément de liste vide
      const newListItem = document.createElement('LI')
      newListItem.textContent = 'Nouveau sous-élément'
      newSubList.appendChild(newListItem)
      
      // Insérer la sous-liste après le contenu de l'élément principal
      listItem.appendChild(newSubList)
      
      // Mettre à jour le contenu
      updateQuillContent(quill)
    }
  }
}

// Fonction pour créer une nouvelle liste ordonnée après une liste à puces
const createNewOrderedList = (quill: any, selection: any) => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const currentList = listItem.parentElement
  
  // Si on est dans une liste à puces, créer une nouvelle liste ordonnée
  if (currentList.tagName === 'UL') {
    // Trouver la liste ordonnée parente
    let parentOrderedList = currentList.parentElement
    while (parentOrderedList && parentOrderedList.tagName !== 'OL') {
      parentOrderedList = parentOrderedList.parentElement
    }
    
    if (parentOrderedList) {
      // Créer un nouvel élément dans la liste ordonnée parente
      const newOrderedItem = document.createElement('LI')
      newOrderedItem.textContent = 'Nouveau point'
      
      // Insérer après l'élément parent
      parentOrderedList.insertBefore(newOrderedItem, currentList.nextSibling)
      
      // Mettre à jour le contenu
      updateQuillContent(quill)
    } else {
      // Créer une nouvelle liste ordonnée
      const newOrderedList = document.createElement('OL')
      newOrderedList.style.marginLeft = '0px'
      newOrderedList.style.marginTop = '8px'
      
      // Ajouter un élément de liste vide
      const newListItem = document.createElement('LI')
      newListItem.textContent = 'Nouveau point'
      newOrderedList.appendChild(newListItem)
      
      // Insérer la nouvelle liste après la liste actuelle
      currentList.parentNode.insertBefore(newOrderedList, currentList.nextSibling)
      
      // Mettre à jour le contenu
      updateQuillContent(quill)
    }
  }
}

// Fonction pour gérer la conversion intelligente des listes
const smartListConversion = (quill: any, selection: any, targetType: 'ul' | 'ol') => {
  const [block] = quill.getLine(selection.index)
  if (!block) return

  const listItem = block.domNode
  const currentList = listItem.parentElement
  
  if (currentList.tagName === targetType.toUpperCase()) {
    // Même type de liste, juste indenter
    indentList(quill, selection)
    return
  }
  
  // Conversion entre types de listes
  if (currentList.tagName === 'OL' && targetType === 'ul') {
    convertToBulletList(quill, selection)
  } else if (currentList.tagName === 'UL' && targetType === 'ol') {
    convertToOrderedList(quill, selection)
  }
  
  // Maintenir la continuité après conversion avec un délai plus long
  setTimeout(() => {
    maintainOrderedListContinuity(quill)
    // Détecter et corriger les doublons
    fixDuplicateListItems(quill)
    // Restructurer en structure hiérarchique
    restructureToHierarchical(quill)
    // Forcer la mise à jour du contenu
    updateQuillContent(quill)
  }, 200)
}

// Synchronise content si modelValue change
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue || ''
  }
}, { immediate: true })

// Nettoyage lors de la destruction du composant
onUnmounted(() => {
  if (quillInstance.value && quillInstance.value._smartListCleanup) {
    quillInstance.value._smartListCleanup()
  }
})
</script>


<style scoped>
.quill-editor-wrapper {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  overflow: hidden;
}

.quill-editor {
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
}

:deep(.ql-editor) {
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
  overflow-y: auto;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

:deep(.ql-editor.ql-blank::before) {
  color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity));
  font-style: normal;
}

:deep(.ql-toolbar) {
  border: none;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background: rgba(var(--v-theme-surface), 0.5);
  padding: 8px;
}

:deep(.ql-toolbar .ql-stroke) {
  stroke: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-toolbar .ql-fill) {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-toolbar .ql-picker-label) {
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
}

:deep(.ql-container) {
  border: none;
  font-family: inherit;
}

/* Messages d'erreur */
.v-messages--error .v-messages__message {
  color: rgb(var(--v-theme-error));
  font-size: 12px;
  padding-left: 16px;
}

/* Thème bubble - toolbar contextuelle */
.quill-editor:not(.has-toolbar) :deep(.ql-toolbar) {
  /* La toolbar bubble apparaît automatiquement lors de la sélection */
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Force l'affichage du contenu pour les éditeurs bubble */
.quill-editor:not(.has-toolbar) :deep(.ql-container) {
  min-height: v-bind(minHeight);
  border: none;
}

/* S'assurer que l'éditeur bubble est cliquable */
.quill-editor:not(.has-toolbar) :deep(.ql-editor) {
  cursor: text;
}

/* Styles pour les listes */
:deep(.ql-editor ul) {
  padding-left: 24px;
}

:deep(.ql-editor ol) {
  padding-left: 24px;
}

:deep(.ql-editor li) {
  margin: 4px 0;
}

/* Styles pour les listes imbriquées */
:deep(.ql-editor ul ul),
:deep(.ql-editor ol ol),
:deep(.ql-editor ul ol),
:deep(.ql-editor ol ul) {
  margin-top: 4px;
  margin-bottom: 4px;
}

/* Indication visuelle pour les listes imbriquées */
:deep(.ql-editor ul[style*="margin-left: 24px"]),
:deep(.ql-editor ol[style*="margin-left: 24px"]) {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.2);
  padding-left: 16px;
  margin-left: 8px;
}

/* Amélioration de l'espacement des listes */
:deep(.ql-editor li) {
  line-height: 1.6;
  padding: 2px 0;
}

/* Styles pour les puces et numéros */
:deep(.ql-editor ul li::marker) {
  color: rgba(var(--v-theme-primary), 0.7);
}

:deep(.ql-editor ol li::marker) {
  color: rgba(var(--v-theme-primary), 0.7);
  font-weight: 600;
}

/* Gestion de la numérotation personnalisée pour les listes ordonnées */
:deep(.ql-editor ol li[data-value]) {
  counter-reset: none;
}

:deep(.ql-editor ol li[data-value]::marker) {
  content: counter(list-item) ". ";
  counter-increment: list-item;
}

/* Amélioration de l'espacement pour les listes imbriquées */
:deep(.ql-editor ol ol) {
  counter-reset: list-item;
}

:deep(.ql-editor ol ol li) {
  counter-increment: list-item;
}

/* Styles pour les listes mixtes (ordonnées + à puces) */
:deep(.ql-editor ol + ul) {
  margin-top: 8px;
  margin-bottom: 8px;
}

:deep(.ql-editor ul + ol) {
  margin-top: 8px;
  margin-bottom: 8px;
}

/* Styles pour les structures hiérarchiques */
:deep(.ql-editor ol li ul) {
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 24px;
}

:deep(.ql-editor ul li ol) {
  margin-top: 8px;
  margin-bottom: 8px;
  margin-left: 24px;
}

/* Amélioration de l'espacement pour les listes imbriquées */
:deep(.ql-editor ol li) {
  margin-bottom: 8px;
}

:deep(.ql-editor ul li) {
  margin-bottom: 4px;
}

/* Indication visuelle pour les conversions de listes */
:deep(.ql-editor ol li[data-converted="true"]) {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 8px;
  margin-left: 4px;
}

:deep(.ql-editor strong) {
  font-weight: 600;
}

:deep(.ql-editor em) {
  font-style: italic;
}

:deep(.ql-editor u) {
  text-decoration: underline;
}
</style>
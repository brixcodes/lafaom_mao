<template>
  <div>
    <VCard>
      <VCardTitle>Informations sur les permissions</VCardTitle>
      <VCardText>
        <VAlert type="info" variant="tonal" class="mb-4">
          <VIcon icon="ri-information-line" class="mr-2" />
          Utilisez les sections ci-dessous pour gérer les permissions et rôles des utilisateurs.
          Les permissions peuvent être assignées directement ou héritées via les rôles.
        </VAlert>
        
        <VRow>
          <VCol cols="12" md="4">
            <VCard variant="outlined" class="text-center pa-4">
              <VIcon icon="ri-key-2-line" size="48" color="primary" class="mb-2" />
              <h6 class="text-h6 mb-2">Permissions directes</h6>
              <p class="text-body-2 text-medium-emphasis">
                Assignez ou révoquez des permissions spécifiques.
              </p>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="4">
            <VCard variant="outlined" class="text-center pa-4">
              <VIcon icon="ri-shield-user-line" size="48" color="secondary" class="mb-2" />
              <h6 class="text-h6 mb-2">Gestion des rôles</h6>
              <p class="text-body-2 text-medium-emphasis">
                Attribuez des rôles qui incluent plusieurs permissions
              </p>
            </VCard>
          </VCol>
          
          <VCol cols="12" md="4">
            <VCard variant="outlined" class="text-center pa-4">
              <VIcon icon="ri-group-line" size="48" color="success" class="mb-2" />
              <h6 class="text-h6 mb-2">Permissions héritées</h6>
              <p class="text-body-2 text-medium-emphasis">
                Visualisez les permissions obtenues via les rôles
              </p>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </div>
</template>

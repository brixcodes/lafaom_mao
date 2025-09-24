<template>
  <VCard>
    <VCardText>
      <div class="d-flex align-center justify-space-between mb-4">
        <h2>Specialties</h2>
        <VBtn
          color="primary"
          @click="handleCreate"
        >
          New Specialty
        </VBtn>
      </div>

      <VList v-if="!isLoading && specialties.length > 0">
        <template
          v-for="specialty in specialties"
          :key="specialty.id"
        >
          <VListItem>
            <template #prepend>
              <div class="me-3">
                <VListItemTitle>{{ specialty.name }}</VListItemTitle>
                <small v-if="specialty.description">{{ specialty.description }}</small>
              </div>
            </template>

            <template #append>
              <div class="d-flex gap-2">
                <VBtn
                  icon
                  variant="text"
                  color="default"
                  size="x-small"
                  @click="handleEdit(specialty.id)"
                >
                  <VIcon icon="tabler-edit" />
                </VBtn>

                <VBtn
                  icon
                  variant="text"
                  color="error"
                  size="x-small"
                  @click="handleDelete(specialty.id)"
                >
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </div>
            </template>
          </VListItem>

          <VDivider />
        </template>
      </VList>

      <div
        v-else-if="!isLoading && specialties.length === 0"
        class="text-center pa-4"
      >
        <p class="text-medium-emphasis">No specialties found.</p>
        <VBtn
          color="primary"
          @click="handleCreate"
        >
          Create First Specialty
        </VBtn>
      </div>

      <VProgressCircular
        v-else
        indeterminate
        class="d-block mx-auto my-4"
      />
    </VCardText>
  </VCard>
</template>

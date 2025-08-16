<template>
  <NuxtLayout>
    <NuxtPage />
    
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      :visible="toast.visible"
      @close="removeToast(toast.id)"
    />
  </NuxtLayout>
</template>

<script setup>
const { toasts, removeToast } = useToast()
</script>
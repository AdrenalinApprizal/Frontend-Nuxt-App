<template>
  <i :class="iconClass" />
</template>

<script setup lang="ts">
interface Props {
  name: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: ''
})

const iconClass = computed(() => {
  const baseClass = props.class || ''
  
  // Map icon names to FontAwesome classes
  const iconMap: Record<string, string> = {
    // Eye icons
    'fa:eye': 'fas fa-eye',
    'fa:eye-slash': 'fas fa-eye-slash',
    
    // Basic icons
    'fa:search': 'fas fa-search',
    'fa:info-circle': 'fas fa-info-circle',
    'fa:ellipsis-v': 'fas fa-ellipsis-v',
    'fa:chevron-up': 'fas fa-chevron-up',
    'fa:chevron-down': 'fas fa-chevron-down',
    'fa:cloud-upload': 'fas fa-cloud-upload-alt',
    'fa:exclamation-triangle': 'fas fa-exclamation-triangle',
    'fa:edit': 'fas fa-edit',
    'fa:file': 'fas fa-file',
    'fa:paperclip': 'fas fa-paperclip',
    'fa:times': 'fas fa-times',
    'fa:arrow-left': 'fas fa-arrow-left',
    'fa:phone': 'fas fa-phone',
    'fa:video': 'fas fa-video',
    'fa:cog': 'fas fa-cog',
    'fa:plus': 'fas fa-plus',
    'fa:user': 'fas fa-user',
    'fa:users': 'fas fa-users',
    'fa:send': 'fas fa-paper-plane',
    'fa:smile': 'fas fa-smile',
    'fa:image': 'fas fa-image',
    'fa:microphone': 'fas fa-microphone',
    'fa:camera': 'fas fa-camera',
    
    // Lucide icons mapped to FontAwesome
    'lucide:x': 'fas fa-times',
    'lucide:paperclip': 'fas fa-paperclip',
    'lucide:send': 'fas fa-paper-plane',
    'lucide:smile': 'fas fa-smile',
    'lucide:image': 'fas fa-image',
    'lucide:mic': 'fas fa-microphone',
    'lucide:camera': 'fas fa-camera',
  }
  
  const faClass = iconMap[props.name] || 'fas fa-question-circle'
  
  return `${faClass} ${baseClass}`.trim()
})
</script>

# add `dark` here to apply dark mode on initial load,
# since `onMounted` doesn't run during SSR
import { useData } from 'vitepress'
import { onBeforeUnmount, onMounted, ref } from 'vue'


const { isDark } = useData()

onMounted(() => {
  document.documentElement.classList.add('dark')
})

onBeforeUnmount(() => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
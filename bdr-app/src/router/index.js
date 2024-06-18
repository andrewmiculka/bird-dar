import { createRouter, createWebHistory } from 'vue-router'
import BirdDarView from '../components/BirdDarView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'birddar',
      component: BirdDarView,
      props: true,
    },
  ]
})

export default router

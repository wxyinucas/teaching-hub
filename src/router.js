import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CourseView from './views/CourseView.vue'
import RunbookView from './views/RunbookView.vue'
import SlidesView from './views/SlidesView.vue'
import NotFoundView from './views/NotFoundView.vue'

export function createTeachingRouter(history = createWebHashHistory(import.meta.env.BASE_URL)) {
  return createRouter({
    history,
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/terms/:termId/courses/:courseId', name: 'course', component: CourseView, props: true },
      {
        path: '/terms/:termId/courses/:courseId/weeks/:weekId/runbook',
        name: 'runbook', component: RunbookView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/weeks/:weekId/slides/:page?',
        name: 'slides', component: SlidesView, props: true,
      },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
    scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0, left: 0 },
  })
}

import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CourseView from './views/CourseView.vue'
import RunbookView from './views/RunbookView.vue'
import SlidesView from './views/SlidesView.vue'
import GuideView from './views/GuideView.vue'
import DemoView from './views/DemoView.vue'
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
      {
        path: '/terms/:termId/courses/:courseId/weeks/:weekId/guide',
        name: 'guide', component: GuideView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/weeks/:weekId/demos/:demoId',
        name: 'demo', component: DemoView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/topics/:topicId/runbook',
        name: 'topic-runbook', component: RunbookView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/topics/:topicId/slides/:page?',
        name: 'topic-slides', component: SlidesView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/topics/:topicId/guide',
        name: 'topic-guide', component: GuideView, props: true,
      },
      {
        path: '/terms/:termId/courses/:courseId/topics/:topicId/demos/:demoId',
        name: 'topic-demo', component: DemoView, props: true,
      },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
    scrollBehavior: (_to, _from, savedPosition) => savedPosition ?? { top: 0, left: 0 },
  })
}

import { createApp } from 'vue'
import App from './App.vue'
import { createTeachingRouter } from './router.js'
import 'katex/dist/katex.min.css'
import './styles/tokens.css'
import './styles/site.css'
import './styles/runbook.css'
import './styles/slides.css'
import './styles/math.css'

createApp(App).use(createTeachingRouter()).mount('#app')

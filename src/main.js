import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { reveal } from './reveal'

createApp(App).directive('reveal', reveal).mount('#app')

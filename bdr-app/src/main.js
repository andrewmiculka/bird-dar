import './assets/main.css'
import 'primevue/resources/themes/aura-dark-pink/theme.css';

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import FloatLabel from 'primevue/floatlabel';
import Slider from 'primevue/slider';

const app = createApp(App)
app.use(PrimeVue);

app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('FloatLabel', FloatLabel);
app.component('Slider', Slider);

app.use(router)

app.mount('#app')

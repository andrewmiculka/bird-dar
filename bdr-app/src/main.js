import './assets/main.css'
import 'primevue/resources/themes/aura-dark-pink/theme.css';

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import FloatLabel from 'primevue/floatlabel';

const app = createApp(App)
app.use(PrimeVue);

app.component('Button', Button);
app.component('Dropdown', Dropdown);
app.component('MultiSelect', MultiSelect);
app.component('FloatLabel', FloatLabel);

app.use(router)

app.mount('#app')

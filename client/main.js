import "regenerator-runtime/runtime";

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './assets/styles.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown, faTimes, faChevronLeft, faCrop, faCrosshairs, faUndo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUndo);
library.add(faCrosshairs);
library.add(faCrop);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faChevronDown);
library.add(faTimes);

Vue.component('fa', FontAwesomeIcon)
import Heading from './components/Heading';
Vue.use(Heading);
Vue.use(VueRouter);

import hash from 'object-hash';
Vue.use({
  install() {
    Vue.prototype.$hash = hash;
  }
})
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

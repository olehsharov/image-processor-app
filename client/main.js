import "regenerator-runtime/runtime";

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import './assets/styles.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faChevronDown, faTimes, faChevronLeft, faCrop, faCrosshairs, faUndo, faFolder, faFile, faFolderOpen, faStar, faCopy, faPaste, faCheck, faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faImage);
library.add(faUndo);
library.add(faCrosshairs);
library.add(faStar);
library.add(faFile);
library.add(faFolder);
library.add(faFolderOpen);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faChevronDown);
library.add(faTimes);

Vue.component('fa', FontAwesomeIcon)

import autofocus from "vue-autofocus-directive";
Vue.directive("autofocus", autofocus);


import { VLazyImagePlugin } from "v-lazy-image";

Vue.use(VLazyImagePlugin);

import Heading from './components/Heading';
import Loading from './components/Loading'

Vue.component('Loading', Loading);
Vue.component('Heading', Heading);
Vue.use(VueRouter);

import ImportView from './views/ImportView';
import LibrariesView from './views/LibrariesView';
import LibraryView from './views/LibraryView';
import RenderView from "./views/RenderView";
import ExportView from "./views/ExportView";

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: "/", component: LibrariesView },
    { path: "/library/:name", component: LibraryView },
    { path: "/library/:name/starred", component: LibraryView, props: { starred: true } },
    { path: "/library/:name/:import/**", component: ImportView },
    { path: "/render/:name/:image", component: RenderView },
    { path: "/export/**", component: ExportView }
  ]
});

import hash from 'object-hash';
Vue.use({
  install() {
    Vue.prototype.$hash = hash;
  }
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

<template>
  <div class="flex min-h-screen relative ">
    <div class="fixed inset-0 z-20 flex items-center justify-center" style="background: rgba(255,255,255,0.4)" v-if="loading">
      <Loading class="w-12 h-12"></Loading>
    </div>
    <div class="w-128 border-r border-gray-900">
        <library v-model="image" :images="images"></library>
    </div>
    <div class="w-full flex" :style="{opacity : !image ? 0.2 : 1}">
      <div class="relative w-full flex flex-col">
        <Heading>
          <span slot="default">
            <span>РЕТУШЬ</span>
            {{image && ' | '}}
            {{image && image.file}}
          </span>
          <div slot="subtitle" :class="`mode_${mode}`">
            <a href="#" class="original" @click="() => mode = 'original'">Оригинал</a>&nbsp;{{image && image.settings ? '|' : ''}}&nbsp;<a href="#" v-if="image && image.settings" class="edited" @click="() => mode = 'edited'">Ретушь</a>
          </div>
          <div slot="action" class="flex">
            <button class="btn btn-xs btn-dark w-24 flex justify-center" v-if="image && image.settings" @click="() => exportImage()">
              <Loading v-if="exporting == image.file" class="w-4 h-4"></Loading>
              <span v-else>Експорт</span>
            </button>
          </div>
        </Heading>
        <div class="p-6 bg-white flex-grow" ref="image">
          <div class="aspect-ratio-square relative overflow-hidden" v-if="image && mode=='original'" style="background: #f7f7f7" >
            <div class="absolute flex justify-center items-center inset-0">
              <FileImage class="absolute h-full" :src="`/images/${image.file}/original?size=680`" :key="image.file"></FileImage>
            </div>
          </div>
          <div class="aspect-ratio-square overflow-hidden relative" v-if="image && image.settings && mode=='edited'" style="background: #f7f7f7" >
            <CssRenderer v-model="image"></CssRenderer>
          </div>
        </div>
      </div>
      <div class="border-l border-gray-900 w-50p flex flex-col">
        <Heading>Настройки</Heading>
        <div class="flex-grow relative" >
          <div class="absolute inset-0 overflow-y-scroll" v-if="image && image.settings">
              <LayersSimpleSettings v-model="image.settings"></LayersSimpleSettings>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.mode_original > .original { @apply text-gray-800 pointer-events-none; }
.mode_original > .edited { @apply text-blue-600; }
.mode_edited > .original { @apply text-blue-600; }
.mode_edited > .edited { @apply text-gray-800 pointer-events-none; }
</style>

<script>

import {throttle} from 'lodash';
import imageLibrary from './services/ImageLibrary';
import Heading from './components/Heading';
import LayersSimpleSettings from './components/LayersSimpleSettings';
import Loading from './components/Loading';
import FileImage from './components/FileImage';
import Layer from './components/Layer';
import Slider from './components/Slider';
import CssRenderer from './components/CssRenderer';
import Library from './components/Library';

export default {
  name: 'App',
  components: { Library, CssRenderer, Heading, LayersSimpleSettings, Loading, FileImage, CssRenderer },
  data() {
    return {
      fixing: false,
      loading: false,
      folder: null,
      images: null,
      imagePath: null,
      image: null,
      mode: "original", // edited,
      exporting: null
    }
  },
  watch: {
    "image.settings": {
      immediate:false,
      deep: true,
      handler() {
        this.mode = this.image && this.image.settings ? "edited" : "original";
        this.save();
      }
    }
  },
  methods: {
    save: throttle(function() {
      if (this.image && this.image.settings) {
        imageLibrary.saveSettings(this.image.file, this.image.settings);
      }
    }, 1000),
   async exportImage() {
      this.exporting = this.image.file;
      await imageLibrary.exportImage(this.image.file);
      this.exporting = null;
    }
  },
  async mounted() {
    this.images = await imageLibrary.list();
    this.image = this.images[0];
  }
}
</script>

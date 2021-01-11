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
            <button class="btn btn-xs btn-dark" v-if="image && image.settings" @click="() => exportImage()">Експорт</button>
          </div>
        </Heading>
        <div class="p-6 bg-white flex-grow" ref="image">
          <div class="aspect-ratio-square relative overflow-hidden" v-if="image && mode=='original'" style="background: #f7f7f7" >
            <div class="absolute flex justify-center items-center inset-0">
              <FileImage class="absolute h-full" :src="`/images/${image.file}/original?size=680`" :key="image.file"></FileImage>
            </div>
          </div>
          <div class="aspect-ratio-square overflow-hidden relative" v-if="image && image.settings && mode=='edited'" style="background: #f7f7f7" >
            <div class="absolute flex justify-center items-center  inset-0" :style="transformStyles">
              
              <Layer class="absolute flex justify-center items-center inset-0" :settings="image.settings.backgroundSettings" :orientation="image.orientation">
                <ImageLayer class="absolute h-full" :src="`/images/${image.file}/original`" ></ImageLayer>
                <ImageLayer class="absolute  h-full" :src="`/images/${image.file}/foreground`" :settings="{blend: 'difference', filters: { contrast: {value: '-10'}, blur: { value: '1'}} }"></ImageLayer>
              </Layer>
              <GradientLayer class="absolute inset-0 -m-2" :settings="image.settings.maskSettings" :transform="image.settings.transform"></GradientLayer>
              <Layer class="absolute flex justify-center items-center inset-0" :style="sharpnessStyles" :orientation="image.orientation">
                <ImageLayer class="absolute  h-full" :src="`/images/${image.file}/foreground`" :settings="image.settings.foregroundSettings" ></ImageLayer>
              </Layer>
              <EditBox v-if="image.settings.maskSettings.edit" v-model="image.settings.maskSettings.gradient" :transform="image.settings.transform"></EditBox>
              <svg>
                <filter :id="sharpenssId">
                  <feConvolveMatrix :order="sharpnessOrder" :kernelMatrix="sharpnessMatrix" preserveAlpha="false"/>
                </filter>
              </svg>

            </div>
          </div>
        </div>
      </div>
      <div class="border-l border-gray-900 w-50p flex flex-col">
        <Heading>Настройки</Heading>
        <div class="flex-grow relative" >
          <div class="absolute inset-0 overflow-y-scroll" v-if="image && image.settings">
              <LayersSimpleSettings v-model="image.settings"></LayersSimpleSettings>
              <Slider min=0 max=0.7 :value="sharpness" @input="(v) => $set(image.settings, 'sharpness', v)" step=0.001 class="mx-8" title="Резкость"></Slider>
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
import Library from './components/Library';
import Heading from './components/Heading';
import ImageLayer from './components/ImageLayer';
import LayersSimpleSettings from './components/LayersSimpleSettings';
import LayersAdvancedSettings from './components/LayersAdvancedSettings';
import EditBox from './components/EditBox';
import Loading from './components/Loading';
import FileImage from './components/FileImage';
import Layer from './components/Layer';
import GradientLayer from './components/GradientLayer';
import Slider from './components/Slider';

export default {
  name: 'App',
  components: { Library, Heading, ImageLayer, LayersSimpleSettings, EditBox, Loading, FileImage, Layer, GradientLayer, Slider },
  data() {
    return {
      fixing: false,
      loading: false,
      folder: null,
      images: null,
      imagePath: null,
      image: null,
      mode: "original", // edited,
      export: false,
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
  computed: {
    sharpness() {
      return (this.image && this.image.settings && this.image.settings.sharpness) || 0;
    },
    sharpnessOrder() {
      return 3;
    },
    sharpnessMatrix() {
      var s = this.sharpness * -1;
      var kernel = 
      [
        [s, s, s],
        [s, 7, s],
        [s, s, s]
      ]
      var result = kernel.map(r => r.join(' ')).join(' ');
      return result;
    },
    sharpenssId() {
        return this.sharpnessMatrix.split(' ').join('');
    },
    sharpnessStyles() {
      return {
        filter: `url(#${this.sharpenssId})`
      }
    },
    transformStyles() {
      return {
        transform: this.image && this.image.settings && `scale(${this.image.settings.transform.scale || 1}) translateX(${(this.image.settings.transform.x || 0) * -100}%) translateY(${(this.image.settings.transform.y || 0) * -100}%)`
      }
    }
  },
  methods: {
    save: throttle(function() {
      if (this.image && this.image.settings) {
        imageLibrary.saveSettings(this.image.imagePath, this.image.settings);
      }
    }, 1000),
   async exportImage() {
      this.loading = true;
      await imageLibrary.exportImage(this.$refs.image, this.image.imagePath);
      this.loading = false;
    }
  },
  async mounted() {
    this.images = await imageLibrary.list();
    this.image = this.images[0];
  }
}
</script>

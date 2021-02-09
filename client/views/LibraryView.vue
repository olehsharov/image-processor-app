<template>
    <div class="flex-grow flex">
        <div class="min-w-192 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Библиотека</Heading>
            <Library :name="$route.params.name" @preview="loadPreview($event)" @select="select($event)"></Library>
            <div class="border-t border-gray-900 px-4 py-3 flex">
                <router-link class="btn" :to="`/`">Библиотеки</router-link>
                <div class="flex-grow"></div>
                <router-link class="btn" :to="`/library/${name}/import/`">Импорировать</router-link>
            </div>
        </div>
        <div class="flex-grow flex flex-col bg-gray-800 my-4 rounded overflow-hidden select-none">
            <Heading>Фото<div class="w-full"></div><Loading v-if="metadata && (metadata.starred && !metadata.processed)"></Loading></Heading>
            <div class="p-6 bg-white flex flex-col flex-grow">
                <div class="aspect-ratio-square overflow-hidden relative text-gray-800" v-if="metadata" style="background: #f7f7f7" >
                    <CssRenderer v-model="metadata" :library="$route.params.name" :image="preview"></CssRenderer>
                </div>
            </div>
        </div>
        <div class="min-w-96 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Ретушь</Heading>
            <div class="flex-grow relative">
                <LayersSimpleSettings class="absolute inset-0 overflow-y-auto" v-model="metadata" :selected="selected" @foreground="saveForegroundSettings($event)"></LayersSimpleSettings>
            </div>
        </div>
    </div>
</template>
<script>
import {throttle} from 'lodash';
import CssRenderer from '../components/CssRenderer'
import LayersSimpleSettings from '../components/LayersSimpleSettings'
import LazyImage from '../components/LazyImage'
import Library from '../components/Library'
import imageLibrary from '../services/ImageLibrary'
export default {
    components: { Library, LazyImage,LayersSimpleSettings, CssRenderer },
    data() {
        return {
            loading: true,
            preview: null,
            metadata: null,
            selected: null
        }
    },
    watch: {
        metadata: {
            deep: true,
            handler() {
                this.saveMetadata();
            }
        }
    },
    computed: {
        name() {
            return this.$route.params.name;
        }
    },
    methods: {
        select(images) {
            this.selected = images;
        },
        saveMetadata: throttle(function() {
            if (this.preview && this.metadata) {
                imageLibrary.saveMetadata(this.name, this.preview, this.metadata);
            }
        }, 1000),
        async saveForegroundSettings(settings) {
            this.loading = true;
            await imageLibrary.saveForegroundSettings(this.name, this.selected, settings);
            this.loading = false;
        },
        async loadPreview(img) {
            this.loading = true;
            this.metadata = await imageLibrary.imageMetadata(this.$route.params.name, img)
            this.selected = [];
            this.preview = img;
            this.loading = false;
        }
    }
}
</script>
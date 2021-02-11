<template>
    <div class="flex-grow flex">
        <div class="min-w-192 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Библиотека</Heading>
            <Library :name="$route.params.name" @preview="loadPreview($event)" @select="select($event)" :starred="starred"></Library>
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
                    <CssRenderer v-model="metadata" 
                        :library="$route.params.name" 
                        :image="preview"></CssRenderer>
                </div>
            </div>
        </div>
        <div class="min-w-96 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Ретушь</Heading>
            <div class="border-b py-3 border-gray-900 flex flex-col" v-if="metadata">
                <div class="flex items-center px-4">
                    <div class="w-full"></div>
                    <button class="btn w-12" @click="exportImages()">
                        &nbsp;
                        <fa v-if="!metadata.exporting" icon="image" :class="{'text-orange-400' : metadata.exported}"></fa>
                        <Loading v-if="!metadata.exported && metadata.exporting" class="text-gray-800"></Loading>
                        &nbsp;
                    </button>
                </div>
            </div>
            <div class="flex-grow  flex flex-col">
                <div class="flex flex-grow relative">
                    <LayersSimpleSettings 
                        class="absolute inset-0 overflow-y-auto" 
                        v-model="metadata" 
                        :selected="selected" 
                        @mask="saveMasksSettings($event)"
                        @foreground="saveForegroundSettings($event)"
                        @export="exportImages()">
                    </LayersSimpleSettings>
                </div>
                <div class="px-4 py-3 flex border-t border-gray-900">
                    <div class="flex-grow"></div>
                    <router-link class="btn btn-green" :to="`/export/${name}/`">
                            &nbsp;
                            Обработанные
                            &nbsp;
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {uniq} from 'lodash';
import {throttle} from 'lodash';
import CssRenderer from '../components/CssRenderer'
import LayersSimpleSettings from '../components/LayersSimpleSettings'
import LazyImage from '../components/LazyImage'
import Library from '../components/Library'
import imageLibrary from '../services/ImageLibrary'
export default {
    components: { Library, LazyImage,LayersSimpleSettings, CssRenderer },
    props: ['starred'],
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
        async exportImages() {
            this.$set(this.metadata, 'exporting', true)
            await imageLibrary.exportImages(this.name, uniq([this.preview, ...this.selected]));
        },
        async saveMasksSettings(settings) {
            this.loading = true;
            await imageLibrary.saveMasksSettings(this.name, this.selected, settings);
            this.loading = false;
        },
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
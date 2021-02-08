<template>
    <div class="flex-grow flex">
        <div class="min-w-128 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Библиотека</Heading>
            <Library :name="$route.params.name" @select="loadImage($event)"></Library>
            <div class="border-t border-gray-900 px-4 py-3 flex">
                <router-link class="btn" :to="`/`">Библиотеки</router-link>
                <div class="flex-grow"></div>
                <router-link class="btn" :to="`/library/${name}/import/`">Импорировать</router-link>
            </div>
        </div>
        <div class="flex-grow flex flex-col bg-gray-800 my-4 rounded overflow-hidden">
            <Heading>Фото</Heading>
            <div class="p-6 bg-white flex flex-col flex-grow">
                <div class="aspect-ratio-square relative overflow-hidden w-full" v-if="selected" style="background: #f7f7f7" >
                    <div class="absolute flex justify-center items-center inset-0">
                        <LazyImage class="absolute h-full" :name="$route.params.name" :image="selected" :key="selected"></LazyImage>
                    </div>
                </div>
                <!-- <div class="aspect-ratio-square overflow-hidden relative" v-if="image && image.settings && mode=='edited'" style="background: #f7f7f7" >
                    <CssRenderer v-model="image"></CssRenderer>
                </div> -->
            </div>
        </div>
        <div class="min-w-128 flex flex-col bg-gray-800 m-4 rounded overflow-hidden">
            <Heading>Ретушь</Heading>
        </div>
    </div>
</template>
<script>
import LazyImage from '../components/LazyImage'
import Library from '../components/Library'
export default {
    components: { Library, LazyImage },
    data() {
        return {
            selected: null
        }
    },
    computed: {
        name() {
            return this.$route.params.name;
        }
    },
    methods: {
        loadImage(img) {
            this.selected = img;
        }
    }
}
</script>
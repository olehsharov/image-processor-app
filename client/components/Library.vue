<template>
    <div class="flex flex-col flex-grow relative select-none">
        <div class="bg-gray-800 absolute inset-0 z-10 flex items-center justify-center" v-if="loading"><Loading></Loading></div>
        <div class="border-b border-gray-900">
            <div class="text-xs px-4 border-b border-gray-900 flex-grow text-gray-600" v-if="progress < 100">ИМПОРТ {{progress}}%</div>
            <CollectionDropdown :collections="collectionNames" @select="setCollection($event)" :disabled="selected.length == 0">
                Колекция
            </CollectionDropdown>
        </div>
        <div class="flex flex-grow relative">
            <div class="absolute inset-0 overflow-y-scroll">
                <div v-for="(c, index) in collectionNames" :key="index" 
                    class="flex flex-col relative cursor-pointer">
                    <div class="flex h-20 border-b border-gray-900 hover:bg-gray-700 w-full" @click="toggleOpen(c)">
                        <div class="px-4 w-20 flex justify-center items-center">
                            <fa :icon="open[c] ? 'folder-open' : 'folder'" class="fa-2x"></fa>
                        </div>
                        <div class="flex w-full items-center py-3 pr-4">
                            <b>{{c}}</b>
                            <div class="flex-grow"></div>
                            <div class="text-gray-600">{{collections[c] && collections[c].length || 0}} фото</div>
                        </div>
                    </div>
                    <div class="px-4 py-3 grid grid-cols-4 grid-gap-2 border-b border-gray-900" v-if="open[c]">
                        <div v-for="img in collections[c]" 
                            :key="img.image" 
                            class="p-2 cursor-pointer hover:bg-gray-700 cursor-pointer" 
                            :class="{'bg-gray-600 hover:bg-gray-600' : selected.includes(img.image), 'border' : preview == img.image}" 
                            @click.shift="selectRange(img.image)"
                            @click.meta="toggleSelectAdd(img.image)"
                            @click.exact="previewSelect(img.image)">
                            <img :src="`/api/libraries/${$route.params.name}/images/${img.image}/thumbnail`">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CollectionDropdown from '../components/CollectionDropdown'
import _ from 'lodash'
import imageLibrary from '../services/ImageLibrary'
export default {
    components: { CollectionDropdown },
    data() {
        return {
            loading: false,
            images: null,
            preview: null,
            selected: [],
            open: {
                'default': true
            },
            progress:100
        }
    },
    computed: {
        name() {
            return this.$route.params.name;
        },
        collectionNames() {
            var names = this.images ? _.uniq(this.images.map(img => img.metadata.collection)) : [];
            var defaultCollection = names.filter(name => name == 'default')
            return names.filter(name => name != 'default').sort().concat(defaultCollection);
        },
        collections() {
            return this.images ? _.groupBy(this.images, 'metadata.collection') : [];
        }
    },
    methods: {
        async setCollection(name) {
            this.selected.forEach(selected => {
                this.images.find(img => img.image == selected).metadata.collection = name;
            });
            await imageLibrary.saveCollection(this.name, name, this.selected);
            this.selected = [];
        },
        previewSelect(image) {
            this.preview = image;
            this.selected = [image]
            this.$emit('select', image)
        },
        toggleSelectAdd(image) {
            if (this.selected.includes(image)) {
                this.selected = this.selected.filter(img => img != image);
            } else {
                this.selected.push(image);
            }
        },
        selectRange(img) {
            if (!this.preview) {
                this.previewSelect(img);
            } else {
                var startIndex = this.images.findIndex(image => image.image == this.preview);
                var endIndex   = this.images.findIndex(image => image.image == img);

                for (var i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                    this.selected.push(this.images[i].image)
                }
            }
        },
        toggleOpen(collection) {
            this.$set(this.open, collection, !this.open[collection]);
        },
        async load() {
            this.loading = true;
            this.images = await imageLibrary.listImages(this.name);
            this.loading = false;
        }
    },
    async mounted() {
        this.interval = setInterval(async () => {
            var progress = await imageLibrary.progress(this.name)
            this.progress = parseInt(100 * progress.imported / progress.total)
            // if (this.progress == 100) {
            //     clearInterval(this.interval);
            // }
        }, 1000);
        await this.load();
    }
}
</script>
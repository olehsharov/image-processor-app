<template>
    <div class="flex flex-col flex-grow relative select-none">
        <div class="bg-gray-800 absolute inset-0 z-10 flex items-center justify-center" v-if="loading"><Loading></Loading></div>
        <div class="border-b border-gray-900 flex flex-col">
            <div class="text-xs bg-gray-900 absolute right-0 -mt-8 py-1 px-2 rounded shadow-xl mr-2 flex-grow text-gray-600" v-if="progress < 100">ИМПОРТ {{progress}}%</div>
            <div class="flex items-center px-4">
                <div class="flex items-center cursor-pointer" :class="starred ? 'text-orange-400' : 'text-gray-600'" @click="starred = !starred">
                    <fa icon="star"></fa>
                    &nbsp;&nbsp;Избранное
                </div>
                <div class="flex-grow"></div>
                <CollectionDropdown :collections="collections" :names="collectionNames" @select="setCollection($event)" :disabled="selected.length == 0" :name="name">
                    Переместить
                </CollectionDropdown>
                 <button class="btn" :disabled="selected.length == 0 || !preview" @click="starSelected()">
                    &nbsp;
                    <fa icon="star" :class="hasStars ? 'text-orange-400' : 'text-gray-600'"></fa>
                    &nbsp;
                </button>
            </div>
        </div>
        <div class="flex flex-grow relative">
            <div class="absolute inset-0 overflow-y-scroll">
                <div v-for="(c, index) in collectionNames" :key="index" 
                    class="flex flex-col relative cursor-pointer">
                    <div class="flex h-32 border-b border-gray-900 hover:bg-gray-700 w-full" @click="toggleOpen(c)">
                        <div class="px-4 w-32 flex justify-center items-center">
                            <!-- <fa :icon="open[c] ? 'folder-open' : 'folder'" class="fa-2x"></fa> -->
                            <img :src="`/api/libraries/${name}/images/${collections[c][0].image}/thumbnail`">
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
                            class="p-2 cursor-pointer hover:bg-gray-700 cursor-pointer relative" 
                            :class="{'bg-gray-600 hover:bg-gray-600' : selected.includes(img.image), 'border' : preview == img.image}" 
                            @click.shift="selectRange(img.image)"
                            @click.meta="toggleSelectAdd(img.image)"
                            @click.exact="previewSelect(img.image)">
                            <img :src="`/api/libraries/${name}/images/${img.image}/thumbnail`">
                            <fa v-if="img.metadata.starred  " icon="star" class="text-orange-400 absolute top-0 left-0"></fa>
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
            starred: false,
            loading: false,
            images: null,
            preview: null,
            selected: [],
            open: {
                'default': true
            },
            progress:100,
            hasStars: false
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
        },
    },
    methods: {
        isSelectionStarred() {
            return this.selectionMetadata().find(s => s.metadata.starred) != null;
        },
        imageMetadata(image) {
            return this.images.find(img => img.image == image);
        },
        selectionMetadata() {
            return _.uniq(this.selected).map(selected => this.imageMetadata(selected))
        },
        async starSelected() {
            var selection = this.selectionMetadata();
            if (this.isSelectionStarred()) {
                selection.forEach(s => s.metadata.starred = false);
                await imageLibrary.starImages(this.name, _.uniq(this.selected), false)
            } else {
                selection.forEach(s => s.metadata.starred = true);
                await imageLibrary.starImages(this.name, _.uniq(this.selected), true)
            }
            this.hasStars = this.isSelectionStarred();
        },
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
            this.$emit('preview', image)
            this.hasStars = this.isSelectionStarred();
        },
        toggleSelectAdd(image) {
            if (this.selected.includes(image)) {
                this.selected = this.selected.filter(img => img != image);
            } else {
                this.selected.push(image);
            }
            this.hasStars = this.isSelectionStarred();
            this.$emit('select', _.uniq(this.selected))
        },
        selectRange(img) {
            if (!this.preview) {
                this.previewSelect(img);
            } else {
                var baseImage  = this.images.find(image => image.image == this.preview);
                var images = this.collections[baseImage.metadata.collection];

                var startIndex = images.findIndex(image => image.image == this.preview);
                var endIndex   = images.findIndex(image => image.image == img);

                for (var i = Math.min(startIndex, endIndex); i <= Math.max(startIndex, endIndex); i++) {
                    this.selected.push(images[i].image)
                }
            }
            this.hasStars = this.isSelectionStarred();
            this.$emit('select', _.uniq(this.selected))
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
    },
    destroyed() {
        clearInterval(this.interval)
    }
}
</script>
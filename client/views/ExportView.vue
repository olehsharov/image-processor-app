<template>
  <div class="flex-grow flex items-center justify-center p-12">
    <div class="bg-gray-800 w-full h-full shadow-xl rounded overflow-hidden flex flex-col relative">
        <div class="bg-gray-800 absolute inset-0 z-10 flex items-center justify-center" v-if="loading"><Loading></Loading></div>
        <Heading>Експорт</Heading>
        <div class="flex-grow relative">
          <div class="absolute inset-0 flex items-center justify-center">
              <h1 class="text-gray-700">Еще ничего не выгружено</h1>
          </div>
          <div class="inset-0 absolute overflow-y-auto" v-if="!missing">
            <router-link 
              v-if="path"
              class="border-b border-gray-900 px-4 py-3 flex items-center hover:bg-gray-700 text-gray-400 h-20"
              :to="back">
              <fa icon="chevron-left"></fa>
            </router-link>

            <div 
                v-for="l in list" 
                :key="l.name" 
                class="border-b border-gray-900 flex hover:bg-gray-700 h-20 flex w-full relative">
                <div class="w-24 flex justify-center items-center" v-if="!l.isFile">
                    <fa icon="folder" class="fa-4x"></fa>
                </div>
                <div class="w-24 flex justify-center items-center" v-if="l.isFile && !l.isImage">
                    <fa icon="file" class="fa-4x"></fa>
                </div>
                <div class="w-24 flex justify-center items-center" v-if="l.isFile && l.isImage">
                    <img :src="`/api/export/${path}${l.name}`" class="max-h-full">
                </div>
                <div class="flex flex-col px-4 py-3">
                    <a v-if="l.isFile" :href="`/api/export/${path}${l.name}`" target="_blank" class="text-gray-300 underline"><b>{{l.name}}</b></a>
                    <span v-else class="text-gray-300"><b>{{l.name}}</b></span>
                    <span class="text-xs text-gray-600">{{new Date(l.ctime).toLocaleString('uk')}}</span>
                </div>

                <router-link v-if="!l.isFile"  :to="`${l.name}/`" class="text-gray-400 absolute inset-0"></router-link>
            </div>

            <div class="h-20 flex w-full relative justify-center items-center" v-if="list && list.length == 0">
                <span class="text-gray-700">Нет папок</span>
            </div>
          </div>

        </div>
    </div>
  </div>
</template>

<script>
import FileBrowser from '../components/FileBrowser'
import library from '../services/ImageLibrary'
export default {
    components: {FileBrowser},
    data() {
        return {
            path: null,
            loading: true,
            list: null,
            missing: null,
        }
    },
    watch: {
        "$route.params": {
            handler() {
                this.path = this.$route.params.pathMatch;
                this.load();
            },
            immediate: true
        }
    },
    computed: {
        name() {
            return this.$route.params.name;
        },
        back() {
            if (this.path) {
                var pathTokens = this.$route.fullPath.split('/').filter(t => t);
                pathTokens.pop();
                return pathTokens.length > 0 
                    ? `/${pathTokens.join('/')}/` 
                    : `/${this.$route.path.replace(this.$route.params.pathMatch, '')}`;
            }
            return '/'
        }
    },
    async mounted() {
        await this.load();
    },
    methods: {
        async load() {
            this.loading = true;
            var result = await library.listDir('export', encodeURIComponent(this.path));
            if (result.status === 404) {
                this.list = null;
                this.missing = true;
            } else {
                this.list = await result.json();
            }
            this.loading = false;
        }
    }
}
</script>

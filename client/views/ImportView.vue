<template>
  <div class="flex-grow flex items-center justify-center p-12">
    <div class="bg-gray-800 w-full h-full shadow-xl rounded overflow-hidden flex flex-col relative">
        <div class="bg-gray-800 absolute inset-0 z-10 flex items-center justify-center" v-if="loading"><Loading></Loading></div>
        <Heading>Импортировать<small class="text-gray-700 ml-4">/{{path}}</small></Heading>
        <div class="flex-grow relative">
          <div class="inset-0 absolute overflow-y-auto">
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
                    <img :src="`/api/input/${path}${l.name}`" class="max-h-full">
                </div>
                <div class="flex flex-col px-4 py-3">
                    <b>{{l.name}}</b>
                    <span class="text-xs">{{new Date(l.ctime).toLocaleString('uk')}}</span>
                </div>

                <router-link v-if="!l.isFile"  :to="`${l.name}/`" class="text-gray-400 absolute inset-0"></router-link>
            </div>

            <div class="h-20 flex w-full relative justify-center items-center" v-if="list && list.length == 0">
                <span class="text-gray-700">Нет папок</span>
            </div>

          </div>
        </div>
        <div class="px-4 py-3 flex border-t border-gray-900 flex items-center">
            <router-link :to="`/library/${name}`" class="btn bg-gray-800" @click="importSelected()">
                Назад
            </router-link>
            <div class="w-full"></div>
            <button class="btn" :disabled="!path" @click="importSelected()">
                Импортировать
            </button>
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
            list: null
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
            this.list = await library.listDir('input', this.path);
            this.loading = false;
        },
        async importSelected() {
            this.loading = true;
            await library.importFolder(this.name, this.path);
            this.$router.push(`/library/${this.name}`)
            this.loading = false;
        }
    }
}
</script>

<template>
  <div class="flex-grow flex items-center justify-center">
    <div class="bg-gray-800 w-128 h-50p shadow-xl rounded overflow-hidden flex flex-col relative">
        <div class="bg-gray-800 absolute inset-0 z-10 flex items-center justify-center" v-if="loading"><Loading></Loading></div>
        <Heading>Бобилиотеки</Heading>
        <div class="flex-grow relative">
          <div class="inset-0 absolute overflow-y-auto">
            <div v-for="(l,i) in libraries" 
              @click="click(l.folder)"
              :key="i" 
              class="border-b border-gray-900 px-4 py-3 flex flex-col hover:bg-gray-700 text-gray-400 cursor-pointer items-start">
              <div v-if="rename == l.folder">
                <input type="text" class="text-base bg-transparent outline-none font-bold" v-model="l.metadata.name" v-autofocus @blur="saveName(l)" @keyup.enter="saveName(l)">
              </div>
              <b v-else class="text-base underline" @click.stop="rename = l.folder">{{l.metadata.name}}</b>
              <span class="text-xs">{{new Date(l.ctime).toLocaleString('uk')}}</span>
            </div>
          </div>
        </div>
        <div class="px-4 py-3 flex border-t border-gray-900 ">
          <input type="text" class="input flex-grow mr-4" placeholder="Название библиотеки" v-model="name">
          <button class="btn" :to="`/import`" :disabled="!name" @click="createLibrary()">
              Создать
          </button>
        </div>
    </div>
  </div>
</template>

<script>
import imageLibrary from '../services/ImageLibrary'
export default {
  data() {
    return {
      rename: null,
      loading: true,
      libraries: null,
      name: null
    }
  },
  async mounted() {
    this.load();
  },
  methods: {
    async saveName(library) {
      setTimeout(() => this.rename = null, 200)
      await imageLibrary.setLibraryName(library.folder, library.metadata.name);
    },
    async click(folder) {
      if (this.rename) return
      this.$router.push(`/library/${folder}`)
    },
    async load() {
      this.libraries = await imageLibrary.listLibraries();
      this.loading = false;
    },
    async createLibrary() {
      this.loading = true;
      this.libraries = await imageLibrary.createLibrary(this.name);
      this.name = null;
      this.load();
      this.loading = false;
    }
  }
}
</script>

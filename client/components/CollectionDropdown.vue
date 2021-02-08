<template>
    <div class="relative flex flex-col">
        <div class="px-4 py-3 flex items-center">
            <div class="flex-grow"></div>
            <button class="btn" @click="open = !open" :disabled="disabled">
                <slot></slot>
            </button>
        </div>
        <div class="h-128 right-0 mr-2 mt-2 flex flex-col top-full bg-gray-900 z-50 absolute shadow-2xl rounded overflow-hidden" style="border-bottom: 1px solid #333" v-if="open">
            <div class="flex px-4 py-4 w-full border-b border-gray-900">
                <input type="text" class="input px-1 py-1 text-xs w-full" placeholder="Название" v-model="collection" :disabled="disabled" v-autofocus @keyup.enter.exact="select(collection)">
                <button class="btn btn-small ml-2" @click="select(collection)" :disabled="disabled || !name">Создать</button>
            </div>
            <div class="flex flex-grow relative">
                <div class="flex flex-col absolute inset-0 overflow-y-scroll">
                    <div v-for="(c, i) in names" :key="i" class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex h-20 items-center" @click="select(c)">
                        <img :src="`/api/libraries/${name}/images/${collections[c][0].image}/thumbnail`" class="max-h-full">
                        <span class="pl-4">{{c}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['collections', 'names', 'disabled', 'name'],
    data() {
        return {
            open: false,
            collection: null
        }
    },
    methods: {
        enter() {
            console.log('Enter')
        },
        select(name) {
            this.open = false;
            this.$emit('select', name);
        }
    }
}
</script>
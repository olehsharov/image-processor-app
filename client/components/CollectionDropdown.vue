<template>
    <div class="relative flex flex-col">
        <div class="px-4 py-3 hover:bg-gray-700 cursor-pointer flex items-center" @click="open = !open">
            <slot></slot>
            <div class="flex-grow"></div>
            <fa icon="chevron-down"></fa>
        </div>
        <div class="h-128 flex flex-col top-full bg-gray-800 z-50 absolute w-full shadow-2xl" style="border-bottom: 1px solid #333" v-if="open">
            <div class="flex px-4 py-4 w-full border-b border-gray-900">
                <input type="text" class="input px-1 py-1 text-xs w-full" placeholder="Название" v-model="name" :disabled="disabled">
                <button class="btn btn-small ml-2" @click="select(name)" :disabled="disabled || !name">Создать</button>
            </div>
            <div v-for="(c, i) in collections" :key="i" class="px-4 py-3 hover:bg-gray-700 cursor-pointer" @click="select(c)">
                {{c}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['collections', 'disabled'],
    data() {
        return {
            name: null,
            open: false
        }
    },
    methods: {
        select(name) {
            this.open = false;
            this.$emit('select', name);
        }
    }
}
</script>
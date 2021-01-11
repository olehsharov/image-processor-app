<template>
    <div class="flex flex-col pb-2">
        <div class="text-gray-600 py-1 uppercase flex items-center" style="font-size:10px">
            {{title}}
            <div class="hover:text-gray-300 cursor-pointer ml-1" v-if="defaultValue != undefined && value != defaultValue" @click="() => $emit('input', defaultValue)">
                <fa icon="undo"></fa>
            </div>
            <div class="w-full"></div>
            <span>{{value}}</span>
        </div>
        <input type="range" :value="value || defaultValue" @input="e => $emit('input', e.target.value)" :max="max" :min="min" :step="step">
    </div>
</template>
<script>
export default {
    props: ['title', 'value', 'min', 'max', 'step', 'defaultValue'],

}
</script>
<template>
    <div class="flex flex-col items-start pt-4">
        <div class="text-gray-300 text-xs flex items-center w-full px-4">
            <div class="flex-grow uppercase font-bold">{{title}}</div>
            <slot name="title"></slot>
        </div>
        <div class="py-2 w-full px-4">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props: ['title']
}
</script>
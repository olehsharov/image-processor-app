<template>
    <div class="flex flex-col items-start">
        <div class="uppercase font-bold text-gray-600 text-xs">{{title}}</div>
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
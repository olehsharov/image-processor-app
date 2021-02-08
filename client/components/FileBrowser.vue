<template>
    <div class="flex-grow relative">
        <div class="inset-0 absolute overflow-y-auto">
            contents
        </div>
    </div>
</template>
<script>
const get = async (path) => {
    fetch(path)
}
export default {
    props: ['root'],
    async mounted() {

    }
}
</script>
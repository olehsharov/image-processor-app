<template>
    <img :src="loaded" @load="$emit('load')">
</template>
<script>
export default {
    props: {
        src: String,
    },
    computed: {
        loaded() {
            return this.src || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        },
    }
}
</script>
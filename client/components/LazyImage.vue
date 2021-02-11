<template>
    <img :src="source || emptySrc">
</template>
<script>

const loadImage = async (src) => {
    return new Promise(resolve => {
         var img = new Image();
        img.onload = () => resolve()
        img.src = src
    });
}

export default {
    props: {
        name: String,
        src: String,
        thumbnail: String
    },
    data() {
        return {
            source: null,
        }
    },
    watch: {
        src: {
            immediate: true,
            async handler() {
                await loadImage(this.thumbnail);
                this.loaded();
                this.source = this.thumbnail
                await loadImage(this.src);
                this.source = this.src
            }
        }
    },
    methods: {
        loaded() {
            this.$emit('load')
        }
    },
    computed: {
        lowresSrc() {
            return this.thumbnail
        },
        emptySrc() {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }
    }
}
</script>
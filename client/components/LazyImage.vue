<template>
    <img :src="hiresSrc || lowresSrc || emptySrc">
</template>
<script>
export default {
    props: {
        name: String,
        image: String,
    },
    data() {
        return {
            hiresSrc: null,
        }
    },
    mounted() {
        var img = new Image();
        img.onload = () => this.hiresSrc = img.src
        img.src = `/api/libraries/${this.name}/images/${this.image}`
    },
    computed: {
        lowresSrc() {
            return `/api/libraries/${this.name}/images/${this.image}/thumbnail`
        },
        emptySrc() {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
        }
    }
}
</script>
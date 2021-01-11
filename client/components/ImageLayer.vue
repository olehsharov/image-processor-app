<template>
    <FileImage :src="src" :style="layerStyles" :orientation="orientation" @load="$emit('load')"></FileImage>
</template>
<script>
import FileImage from './FileImage';
import layerStyles from './layerStyles'

export default {
    components: {FileImage},
    props: {
        src: String,
        orientation: Number,
        settings: Object
    },
    computed: {
        layerStyles() {
            return layerStyles(this.settings);
        }
    }
}

</script>
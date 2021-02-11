<template>
    <LazyImage :src="src" :thumbnail="thumbnail" :style="layerStyles" @load="$emit('load')"></LazyImage>
</template>
<script>
import LazyImage from './LazyImage';
import FileImage from './FileImage';
import layerStyles from './layerStyles'

export default {
    components: {LazyImage},
    props: {
        src: String,
        thumbnail: String,
        settings: Object
    },
    computed: {
        layerStyles() {
            return layerStyles(this.settings);
        }
    }
}

</script>
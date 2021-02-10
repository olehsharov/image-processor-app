<template>
    <FileImage :src="src" :style="layerStyles" @load="$emit('load')"></FileImage>
</template>
<script>
import FileImage from './FileImage';
import layerStyles from './layerStyles'

export default {
    components: {FileImage},
    props: {
        src: String,
        settings: Object
    },
    computed: {
        layerStyles() {
            return layerStyles(this.settings);
        }
    }
}

</script>
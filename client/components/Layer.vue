<template>
    <div :style="layerStyles">
        <slot></slot>
    </div>
</template>
<script>
import layerStyles from './layerStyles'

export default {
    props: ['settings'],
    computed: {
        layerStyles() {
            return layerStyles(this.settings);
        }
    }
}
</script>
<template>
    <div :style="styles"></div>
</template>
<script>

export default {
    props: {
        settings: Object,
        transform: Object,
        src: String
    },
    computed: {
        styles() {
            return {
                background: this.settings && this.background(this.settings)
            }
        },
        scale() {
            return (this.transform && this.transform.scale) || 1
        },
        gradientBox() {
            return {
                top: `${this.settings.gradient.y}%`,
                left: `${this.settings.gradient.x}%`,
                width: `${this.settings.gradient.width}%`,
                height: `${this.settings.gradient.height}%`,
                'margin-left': `-${parseInt(this.settings.gradient.width)/2}%`,
                'margin-top': `-${parseInt(this.settings.gradient.height)/2}%`
            }
        }
    },
    methods: {
        rgba(color, opacity = 1) {
            return 'rgba(' + parseInt(color.slice(-6, -4), 16) + ',' + parseInt(color.slice(-4, -2), 16) + ',' + parseInt(color.slice(-2), 16) + ',' + opacity + ')';
        },
        background(settings) {
            var grad = settings.gradient;
            return `radial-gradient(${grad.width}% ${grad.height}% at ${grad.x}% ${grad.y}%, ${this.rgba(grad.from, grad.fromAlpha)}, ${this.rgba(grad.to, grad.toAlpha)})`;
        }
    }
}
</script>
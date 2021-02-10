<template>
    <div class="absolute inset-0">
        <div :style="bottomStyles" class="absolute"></div>
        <div :style="topStyles" class="absolute"></div>
        <div :style="leftStyles" class="absolute"></div>
        <div :style="rightStyles" class="absolute"></div>
        <div :style="boxStyles" class="absolute" ref="centerBox"></div>
    </div>
</template>

<script>
export default {
    props: ['value','transform', 'color'],
    computed: {
        topStyles() {
            return {
                "top": `0%`,
                "left": `${this.value.x}%`,
                "width": `${100}%`,
                "height": `${this.value.y}%`,
                "margin-left": `-${this.value.width/2}%`,
                "margin-top": `-${this.value.height/2}%`,
                "transform": `rotate(${this.value.rotate}deg)`,
                "background" : this.color
            };
        },
        leftStyles() {
            return {
                "top": `0%`,
                "left": `0%`,
                "width": `${this.value.x}%`,
                "height": `100%`,
                "margin-left": `-${this.value.width/2}%`,
                "transform": `rotate(${this.value.rotate}deg)`,
                "background" : this.color
            };
        },
        rightStyles() {
            return {
                "top": `0%`,
                "right": `0%`,
                "left": `${this.value.x  + this.value.width/2}%`,
                "height": `100%`,
                "transform": `rotate(${this.value.rotate}deg)`,
                "background" : this.color
            };
        },
        bottomStyles() {
            return {
                "top": `${this.value.y + this.value.height}%`,
                "left": `${this.value.x}%`,
                "width": `${100}%`,
                "height": `${100}%`,
                "margin-left": `-${this.value.width/2}%`,
                "margin-top": `-${this.value.height/2}%`,
                "transform": `rotate(${this.value.rotate}deg)`,
                "background" : this.color
            };
        },
        boxStyles() {
            return {
                "top": `${this.value.y}%`,
                "left": `${this.value.x}%`,
                "width": `${this.value.width}%`,
                "height": `${this.value.height}%`,
                "margin-left": `-${this.value.width/2}%`,
                "margin-top": `-${this.value.height/2}%`,
                "transform": `rotate(${this.value.rotate}deg)`,
                // "background" : this.color
            };
        },
        scale() {
            return (this.transform && this.transform.scale) || 1;
        }
    },
}
</script>
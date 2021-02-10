<template>
    <div class="absolute inset-0" :style="coverStyles" ref="cover" @mousemove="e => move(e)" id="cover" @mousedown="e => saveOrigin(e)">
        <div :style="boxStyles" class="z-10 border absolute flex justify-center items-center" ref="box" id="box" @mousedown="e => moveStart(e, 'box')">

            <div class="rounded-full bg-gray-900 h-2 w-2"></div>

            <div class="w-2 h-2 -ml-1 -mt-1 left-0 top-0 bg-gray-900 absolute border border-gray-1000" @mousedown="e => moveStart(e,'tl')" id="tl"></div>
            <div class="w-2 h-2 -mr-1 -mt-1 right-0 top-0 bg-gray-900 absolute border border-gray-1000" @mousedown="e => moveStart(e, 'tr')" id="tr"></div>
            <div class="w-2 h-2 -mr-1 -mb-1 right-0 bottom-0 bg-gray-900 absolute border border-gray-1000" @mousedown="e => moveStart(e, 'br')" id="br"></div>
            <div class="w-2 h-2 -ml-1 -mb-1 left-0 bottom-0 bg-gray-900 absolute border border-gray-1000" @mousedown="e => moveStart(e, 'bl')" id="bl"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value','cover', 'transform', 'default'],
    data() {
        return {
            // x: parseFloat(this.value.x),
            // y: parseFloat(this.value.y),
            // width: parseFloat(this.value.width),
            // height: parseFloat(this.value.height),
            moving: null,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            ox: 0,
            oy: 0,
            ow: 0,
            oh: 0
        }
    },
    computed: {
        coverStyles() {
            return this.cover ? {
                "background": "rgba(0,0,0,0.2)",
                "mix-blend-mode": "darken"
            } : {};
        },
        handleStyles() {
            // if (this.moving != 'box') {
            //     return { "pointer-events": "none" } 
            // }
        },
        boxStyles() {
            var movingStyles = {
                "pointer-events": "none",
                'border': '1px solid rgba(0,0,0,0.2)',
            }
            var coveredStyles = {
                "background": "rgba(255,255,255,1)",
                "mix-blend-mode": "lighten",
            }
            var boxStyles = {
                'border': '1px solid #000',
                "top": `${this.value.y}%`,
                "left": `${this.value.x}%`,
                "width": `${this.value.width}%`,
                "height": `${this.value.height}%`,
                "margin-left": `-${this.value.width/2}%`,
                "margin-top": `-${this.value.height/2}%`,
                "transform": `rotate(${this.value.rotate}deg)`
            };
            if (this.moving) boxStyles = Object.assign(boxStyles, movingStyles);
            if (this.cover) boxStyles = Object.assign(boxStyles, coveredStyles);
            return boxStyles;
        },
        scale() {
            return (this.transform && this.transform.scale) || 1;
        }
    },
    methods: {
        saveOrigin(e) {
            var bounds = this.$refs.cover.getBoundingClientRect();
            this.sx = e.clientX/this.scale - (bounds.left/this.scale);
            this.sy = e.clientY/this.scale - (bounds.top/this.scale);
            this.ox = parseFloat(this.value.x);
            this.oy = parseFloat(this.value.y);
            this.ow = parseFloat(this.value.width);
            this.oh = parseFloat(this.value.height);
            this.boxBounds = this.$refs.box.getBoundingClientRect();
        },
        moveStart(e, type) {
            if (this.moving) return;
            this.moving = e.target.id;
            this.$emit('input', this.value);
        },
        move(e) {
            var dx = ((this.sx - e.offsetX) * 100/this.scale) / (this.$refs.cover.clientWidth / this.scale);
            var dy = ((this.sy - e.offsetY ) * 100/this.scale) / (this.$refs.cover.clientHeight / this.scale);


            if (e.altKey == true) {
                if (this.moving == 'box') {
                    this.value.rotate += (this.lx - e.clientX) + (this.ly - e.clientY);
                }
                this.lx = e.clientX;
                this.ly = e.clientY;
                return;
            };

            if (this.moving == 'box') {
                this.value.x = this.ox - dx;
                this.value.y = this.oy - dy;
            }
            if (this.moving == 'tl') {
                this.value.width = this.ow + dx * 2;
                this.value.height = this.oh + dy * 2;
            }
            if (this.moving == 'tr') {
                this.value.width = this.ow - dx * 2;
                this.value.height = this.oh + dy * 2;
            }
            if (this.moving == 'bl') {
                this.value.width = this.ow + dx * 2;;
                this.value.height = this.oh - dy * 2;
            }
            if (this.moving == 'br') {
                this.value.width = this.ow - dx * 2;
                this.value.height = this.oh - dy * 2;
            }
            this.$emit('input', this.value);
        },
        moveEnd() {
            this.moving = null;
            this.$emit('input', this.value);
        }
    },
    mounted() {
        if (!this.value) {
            this.$set(this, 'value', this.default);
            this.$emit('input', this.default)
        }
        window.addEventListener("mouseup", this.moveEnd);
    },
    destroyed() {
        window.removeEventListener("mouseup", this.moveEnd);
    }
}
</script>
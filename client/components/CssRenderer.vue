<template>
    <div class="absolute flex justify-center items-center inset-0" :style="transformStyles">
        <!-- BACKGROUND SEPARATION BASED ON EXTRACTED FOREGROUND -->
        <Layer v-if="value && value.processed"  class="absolute flex justify-center items-center inset-0" :settings="value.backgroundSettings">
            <ImageLayer class="absolute h-full" :src="`/api/libraries/${library}/images/${image}`" @load="imageLoaded()"></ImageLayer>
            <ImageLayer class="absolute  h-full" :src="`/api/libraries/${library}/images/${image}/foreground`" @load="imageLoaded()" :settings="{blend: 'difference', filters: { contrast: {value: '-10'}, blur: { value: '1'}} }"></ImageLayer>
        </Layer>

        <!-- LAYER THAT MAKES SHADOWS POP FORM ORIGINAL IMAGE -->
        <GradientLayer v-if="value && value.processed && !value.maskSettings.off" class="absolute inset-0 -m-2" :settings="value.maskSettings" :transform="value.transform"></GradientLayer>

        <!-- FOREGROUND IF HAVE ONE PROCESSED-->
        <Layer v-if="value && value.processed" class="absolute flex justify-center items-center inset-0" :style="sharpnessStyles">
            <ImageLayer class="absolute  h-full" 
                :src="`/api/libraries/${library}/images/${image}/foreground`" 
                @load="imageLoaded()" 
                :settings="value.foregroundSettings">
            </ImageLayer>
        </Layer>

        <!-- FOREGROUND IF NOT PROCESSED-->
        <Layer v-else class="absolute flex justify-center items-center inset-0" :style="sharpnessStyles" >
            <ImageLayer class="absolute h-full" :src="`/api/libraries/${library}/images/${image}`"  @load="imageLoaded()" :settings="value.foregroundSettings"></ImageLayer>
        </Layer>

        <!-- FOREGROUND: JUST INPUT IMAGE-->
        <Layer v-if="value.maskSettings.off" class="absolute flex justify-center items-center inset-0" :style="sharpnessStyles" >
            <ImageLayer class="absolute h-full" :src="`/api/libraries/${library}/images/${image}`" @load="imageLoaded()" :settings="value.foregroundSettings"></ImageLayer>
        </Layer>

        <Rectangle v-if="value.foregroundSettings.cutout" v-model="value.foregroundSettings.cutout" color="#f7f7f7"></Rectangle>
        <EditBox v-if="value.foregroundSettings.cutout && value.foregroundSettings.cutout.edit" v-model="value.foregroundSettings.cutout" :transform="value.transform"></EditBox>

        <EditBox v-if="value && value.maskSettings.edit" v-model="value.maskSettings.gradient" :transform="value.transform"></EditBox>

        <svg>
            <filter :id="sharpenssId">
                <feConvolveMatrix :order="sharpnessOrder" :kernelMatrix="sharpnessMatrix" preserveAlpha="false"/>
                <feComponentTransfer>
                    <feFuncR type="gamma" :amplitude="hueRotateR" :exponent="1" offset="0"/>
		            <feFuncG type="gamma" amplitude="1" :exponent="1" offset="0"/>
		            <feFuncB type="gamma" :amplitude="hueRotateB" :exponent="1" offset="0"/>
		            <feFuncA type="identity"/>
  	            </feComponentTransfer>
            </filter>
        </svg>
        <!-- <div class="absolute inset-0 p-6 text-gray-900 z-20 overflow-auto">
            <pre style="font-size:9px">
                {{hueRotateR}}
                {{hueRotateB}}
                {{hueExponent}}
{{JSON.stringify(value, null, 2)}}
            </pre>
        </div> -->
        <div class="absolute inset-0 z-20 flex items-center justify-center" style="background: rgba(255,255,255,0.9); " v-if="loaded < imagesToLoad">
            <Loading class="h-12 w-12 text-gray-900"></Loading>
        </div>
    </div>
</template>

<script>
import Loading from './Loading';
import EditBox from './EditBox';
import ImageLayer from './ImageLayer';
import Layer from './Layer';
import Library from './Library';
import GradientLayer from './GradientLayer';
import Rectangle from './Rectangle';

export default {
    props: ['value', 'library', 'image'],
    components: { ImageLayer, Library, GradientLayer, Loading, EditBox, Layer, Rectangle },
    data() {
        return {
            loaded: 0
        }
    },
    watch: {
        image() {
            this.loaded = 0;
        }
    },
    methods: {
        imageLoaded() {
            this.loaded++;
        }
    },
    computed: {
        hueExponent() {
            if (this.value.foregroundSettings) {
                var hue = this.value.foregroundSettings.filters['hue-rotate'].value;
                return 1 + Math.abs(hue/90);
            }
            return 1; 
        },
        hueRotateR() {
            if (this.value.foregroundSettings) {
                var hue = this.value.foregroundSettings.filters['hue-rotate'].value;
                return hue > 0 ? 1 + Math.abs(hue/60) : 1;
            }
            return 1;
        },
        hueRotateB() {
            if (this.value.foregroundSettings) {
                var hue = this.value.foregroundSettings.filters['hue-rotate'].value;
                return hue < 0 ? 1 + Math.abs(hue/60) : 1;
            }
            return 1;
        },
        imagesToLoad() {
            return this.value.processed  ? 3 : 1;
        },
        sharpness() {
            return (this.value && this.value && this.value.sharpness) || 0;
        },
        sharpnessOrder() {
            return 3;
        },
        sharpnessMatrix() {
            var s = this.sharpness * -1;
            var kernel = 
            [
                [s, s, s],
                [s, 7, s],
                [s, s, s]
            ]
            var result = kernel.map(r => r.join(' ')).join(' ');
            return result;
        },
        sharpenssId() {
            return this.sharpnessMatrix.split(' ').join('');
        },
        sharpnessStyles() {
            return {
                filter: `url(#${this.sharpenssId})`
            }
        },
        transformStyles() {
            return {
                transform: this.value && `
                    rotate(${(this.value.transform.rotate || 0)}deg) 
                    scale(${this.value.transform.scale || 1}) 
                    translateX(${(this.value.transform.x || 0) * 100}%) 
                    translateY(${(this.value.transform.y || 0) * -100}%)
                `
            }
        }
    },
}
</script>
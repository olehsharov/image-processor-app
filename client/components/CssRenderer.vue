<template>
    <div class="absolute flex justify-center items-center inset-0" :style="transformStyles">
        <Layer class="absolute flex justify-center items-center inset-0" :settings="value.settings.backgroundSettings">
            <ImageLayer class="absolute h-full" :src="`/images/${value.file}/original`" @load="imageLoaded()"></ImageLayer>
            <ImageLayer class="absolute  h-full" :src="`/images/${value.file}/foreground`" @load="imageLoaded()" :settings="{blend: 'difference', filters: { contrast: {value: '-10'}, blur: { value: '1'}} }"></ImageLayer>
        </Layer>
        <GradientLayer class="absolute inset-0 -m-2" :settings="value.settings.maskSettings" :transform="value.settings.transform"></GradientLayer>
        <Layer class="absolute flex justify-center items-center inset-0" :style="sharpnessStyles" >
            <ImageLayer class="absolute  h-full" :src="`/images/${value.file}/foreground`" @load="imageLoaded()" :settings="value.settings.foregroundSettings" ></ImageLayer>
        </Layer>
        <EditBox v-if="value.settings.maskSettings.edit" v-model="value.settings.maskSettings.gradient" :transform="value.settings.transform"></EditBox>
        <svg>
            <filter :id="sharpenssId">
                <feConvolveMatrix :order="sharpnessOrder" :kernelMatrix="sharpnessMatrix" preserveAlpha="false"/>
            </filter>
        </svg>
        <!-- <div class="absolute inset-0 p-6 text-gray-900 z-20 overflow-auto">
            <pre style="font-size:9px">
{{JSON.stringify(value.settings, null, 2)}}
            </pre>
        </div> -->
        <div class="absolute inset-0 z-20 flex items-center justify-center" style="background: rgba(255,255,255,0.9); " v-if="loaded < 3">
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

export default {
    props: ['value'],
    components: { ImageLayer, Library, GradientLayer, Loading, EditBox, Layer },
    data() {
        return {
            loaded: 0
        }
    },
    watch: {
        value() {
            console.log('Watch')
            this.loaded = 0;
        }
    },
    methods: {
        imageLoaded() {
            this.loaded++;
        }
    },
    computed: {
        sharpness() {
            return (this.value && this.value.settings && this.value.settings.sharpness) || 0;
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
                transform: this.value && this.value.settings && `scale(${this.value.settings.transform.scale || 1}) translateX(${(this.value.settings.transform.x || 0) * -100}%) translateY(${(this.value.settings.transform.y || 0) * -100}%)`
            }
        }
    },
}
</script>
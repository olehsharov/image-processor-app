<template>
    <div class="flex flex-col p-4" v-if="value">
        <SettingsBlock title="Кроп">
            <button class="btn btn-xs btn-dark"><fa icon="crop"></fa>&nbsp;&nbsp;Обрезать</button>
            <Slider title="Top" :min=-100 :max=100  :step=1  v-model="value.crop.top"></Slider>
            <Slider title="Bottom" :min=-100 :max=100  :step=1  v-model="value.crop.bottom"></Slider>
            <Slider title="Left" :min=-100 :max=100  :step=1  v-model="value.crop.left"></Slider>
            <Slider title="Right" :min=-100 :max=100  :step=1  v-model="value.crop.right"></Slider>
        </SettingsBlock>
        <SettingsBlock title="Задник">
           <Slider v-for="f in filters" 
                :title="f.name" 
                :key="f.name" 
                :max="f.max" 
                :min="f.min" 
                :step="f.step" 
                v-model="value.backdropSettings.filters[f.name].value">
            </Slider>
        </SettingsBlock>
        <SettingsBlock title="Фон">
           <Slider v-for="f in filters" 
                :title="f.name" 
                :key="f.name" 
                :max="f.max" 
                :min="f.min" 
                :step="f.step" 
                v-model="value.backgroundSettings.filters[f.name].value">
            </Slider>
        </SettingsBlock>
        <SettingsBlock title="Тень">
           <button class="btn btn-xs btn-dark"><fa icon="crosshairs"></fa>&nbsp;&nbsp;Поставить</button>
           <Slider v-for="f in filters" 
                :title="f.name" 
                :key="f.name" 
                :max="f.max" 
                :min="f.min" 
                :step="f.step" 
                v-model="value.maskSettings.filters[f.name].value">
            </Slider>
        </SettingsBlock>
        <SettingsBlock title="Модель">
           <Slider v-for="f in filters" 
                :title="f.name" 
                :key="f.name" 
                :max="f.max" 
                :min="f.min" 
                :step="f.step" 
                v-model="value.foregroundSettings.filters[f.name].value">
            </Slider>
        </SettingsBlock>
        <!-- <pre class="bg-gray-200 text-gray-1200 text-xs">
{{JSON.stringify(value, null, 2)}}
        </pre> -->
    </div>
</template>
<script>

import SettingsBlock from './SettingsBlock';
import Slider from './Slider';
import supportedBlends from './blends';
import supportedFilters from './filters';

export default {
    props: ['value'],
    components: {SettingsBlock, Slider},
    data() {
        return {
            filters: supportedFilters
        }
    }
}
</script>
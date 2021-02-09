<template>
    <div class="flex flex-col" v-if="value">
        <SettingsBlock title="Кроп">
            <Slider title="Зум" :min=0.5 :max=2  :step=0.001  v-model="value.transform.scale" :defaultValue="1"></Slider>
            <Slider title="Горизонт" :min=-45 :max=45  :step=0.1  v-model="value.transform.rotate" :defaultValue="0"></Slider>
            <Slider title="Вретикаль" :min=-0.5 :max=0.5  :step=0.001  v-model="value.transform.y" :defaultValue="0"></Slider>
            <Slider title="Горизонталь" :min=-0.5 :max=0.5  :step=0.001 v-model="value.transform.x" :defaultValue="0"></Slider>
        </SettingsBlock>
        <SettingsBlock title="Тень">
           <div class="flex">
            <button class="btn btn-xs btn-dark mr-2" :disabled="value.maskSettings.off" @click="() => toggleEditMask()"><fa icon="crosshairs"></fa>&nbsp;&nbsp;Редактировать</button>
            <button class="btn btn-xs btn-dark" v-if="!value.maskSettings.off" @click="() => toggleMask()">Выключить</button>
            <button class="btn btn-xs btn-dark" v-if="value.maskSettings.off == true" @click="() => toggleMask()">Включить</button>
           </div>
           <Slider title="Размытие" 
                :max="value.backgroundSettings.filters['blur'].max" 
                :min="value.backgroundSettings.filters['blur'].min" 
                :step="value.backgroundSettings.filters['blur'].step"
                :defaultValue="0"
                v-model="value.backgroundSettings.filters['blur'].value">
            </Slider>
           <Slider title="Яркость" 
                :max="value.backgroundSettings.filters['opacity'].max" 
                :min="value.backgroundSettings.filters['opacity'].min" 
                :step="value.backgroundSettings.filters['opacity'].step"
                :defaultValue="1"
                v-model="value.backgroundSettings.filters['opacity'].value">
            </Slider>
           <Slider title="Контраст" 
                :max="value.backgroundSettings.filters['contrast'].max" 
                :min="value.backgroundSettings.filters['contrast'].min" 
                :step="value.backgroundSettings.filters['contrast'].step" 
                :defaultValue="1"
                v-model="value.backgroundSettings.filters['contrast'].value">
           </Slider>
           <Slider title="Цвет" 
                :max="value.backgroundSettings.filters['saturate'].max" 
                :min="value.backgroundSettings.filters['saturate'].min" 
                :step="value.backgroundSettings.filters['saturate'].step" 
                :defaultValue="1"
                v-model="value.backgroundSettings.filters['saturate'].value">
            </Slider>
        </SettingsBlock>
         <SettingsBlock title="Модель">
           <div slot="title" class="pl-2 flex" v-if="selected && selected.length > 0">
               <span class="text-xs text-gray-600 cursor-pointer" @click="applySettings()">ПРИМЕНИТЬ</span>
           </div>
           <Slider title="Яркость" 
                :max="value.foregroundSettings.filters['brightness'].max" 
                :min="value.foregroundSettings.filters['brightness'].min" 
                :step="value.foregroundSettings.filters['brightness'].step"
                :defaultValue="1" 
                v-model="value.foregroundSettings.filters['brightness'].value">
            </Slider>
           <Slider title="Контраст" 
                :max="value.foregroundSettings.filters['contrast'].max" 
                :min="value.foregroundSettings.filters['contrast'].min" 
                :step="value.foregroundSettings.filters['contrast'].step" 
                :defaultValue="1"
                v-model="value.foregroundSettings.filters['contrast'].value">
           </Slider>
           <Slider title="Цвет" 
                :max="value.foregroundSettings.filters['saturate'].max" 
                :min="value.foregroundSettings.filters['saturate'].min" 
                :step="value.foregroundSettings.filters['saturate'].step" 
                :defaultValue="1"
                v-model="value.foregroundSettings.filters['saturate'].value">
            </Slider>
            <Slider title="Оттенок" 
                :max="30" 
                :min="-30" 
                :step="value.foregroundSettings.filters['hue-rotate'].step" 
                :defaultValue="0"
                v-model="value.foregroundSettings.filters['hue-rotate'].value">
            </Slider>
            <Slider title="Туман" 
                :max="20" 
                :min="0" 
                :step="value.foregroundSettings.filters['invert'].step"
                :defaultValue="0" 
                v-model="value.foregroundSettings.filters['invert'].value">
            </Slider>
            <Slider title="Резкость"
                min=0 
                max=0.7 
                step=0.001
                :defaultValue="0"
                v-model="value.sharpness">
            </Slider>
        </SettingsBlock>
    </div>
</template>
<script>

import SettingsBlock from './SettingsBlock';
import Slider from './Slider';

export default {
    props: ['value', 'selected'],
    components: {SettingsBlock, Slider},
    methods: {
        applySettings() {
            this.$emit('foreground', {
                sharpness: this.value.sharpness,
                foregroundSettings: Object.assign({}, this.value.foregroundSettings)
            })
        },
        toggleMask() {
            this.$set(this.value.maskSettings, 'off', !this.value.maskSettings.off);
        },
        toggleEditMask() {
            this.$set(this.value.maskSettings, 'edit', !this.value.maskSettings.edit);
        }
    }
}
</script>
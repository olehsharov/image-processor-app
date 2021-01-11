<template>
  <div class="w-full h-full flex flex-col">
    <Heading>
        <span slot="default">
          ФОТО
        </span>
    </Heading>
    <div class="flex-grow relative">
      <div class="absolute inset-0 overflow-y-scroll pt-6 pb-6">
        <div v-for="img in images" class="flex flex-col mb-6 p-4 m-4 rounded cursor-pointer" :key="img.file" @click="$emit('input', img)" :class="{'bg-gray-800' : value && value.file == img.file}">
          <div class="relative aspect-ratio-square">
            <div class="absolute inset-0 overflow-hidden flex items-center justify-center">
              <FileImage :src="`/images/${img.file}/original?size=256`" class="max-h-full"></FileImage>
            </div>
          </div>
          <div class="flex pt-4 justify-center text-gray-600 z-10">
            {{img.file}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import Heading from './Heading';
import FileImage from './FileImage'
import imagesLibrary from '../services/ImageLibrary';

export default {
  name: "Images",
  props: ['value', 'images'],
  components: {Heading, FileImage},
};
</script>
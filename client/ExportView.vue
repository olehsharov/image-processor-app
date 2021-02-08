<template>
  <div class="bg-greey-400 relative aspect-ratio-square h-full overflow-hidden" style="background: #f7f7f7">
    <CssRenderer v-if="image" v-model="image" class="overflow-hidden"></CssRenderer>
  </div>
</template>

<script>

import imageLibrary from './services/ImageLibrary';
import CssRenderer from './components/CssRenderer';

export default {
  name: 'App',
  components: { CssRenderer, CssRenderer },
  data() {
    return {
      image: null,
    }
  },
  async mounted() {
    console.log(this.$route);
    this.image = await imageLibrary.get(this.$route.params.imageId);
    
  }
}
</script>

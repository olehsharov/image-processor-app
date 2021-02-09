<template>
  <div class="bg-greey-400 w-full relative aspect-ratio-square h-full overflow-hidden" style="background: #f7f7f7">
    <CssRenderer 
      v-if="metadata"
      v-model="metadata"
      :library="$route.params.name"
      :image="$route.params.image"
      class="overflow-hidden"></CssRenderer>
  </div>
</template>

<script>

import imageLibrary from '../services/ImageLibrary';
import CssRenderer from '../components/CssRenderer';

export default {
  name: 'App',
  components: { CssRenderer },
  data() {
    return {
      metadata: null,
    }
  },
  async mounted() {
    var meta = await imageLibrary.imageMetadata(this.$route.params.name, this.$route.params.image)
    meta.maskSettings.edit = false;
    this.metadata = meta;
  }
}
</script>

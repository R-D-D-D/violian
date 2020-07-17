<template lang="pug">
  #score
    div(class="score" ref="scorediv" v-show="!scoreLoading")

    v-btn(@click="changeBars") Change Bars
</template>

<script>
import axios from "axios"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"

export default {
  name: 'OSMD',
  data () {
    return {
      scoreLoading: false,
      osmd: null
    }
  },
 
  methods: {
    changeBars () {
      this.osmd.setOptions({
        drawFromMeasureNumber: 5,
        drawUpToMeasureNumber: 8
      })
      this.osmd.zoom = 1.5
      this.osmd.render()
    }
  },

  mounted: async function () {
    this.osmd = new OpenSheetMusicDisplay(
      this.$refs.scorediv, 
      {
        followCursor: true,
        drawFromMeasureNumber: 0,
        drawUpToMeasureNumber: 4,
        fillEmptyMeasuresWithWholeRest: true,
        drawComposer: false,
        drawTitle: false,
        renderSingleHorizontalStaffline: true,
        measureNumberInterval: 1,
        drawPartNames: false,
        backend: 'Canvas'
      }
    );
    this.scoreLoading = true;
    let scoreXml = await axios({
      url: "https://rhythm-academy.s3-ap-southeast-1.amazonaws.com/twinkle-twinkle-little-star.musicxml",
      method: 'get',
      headers: {
        'Cache-Control': null,
        'X-Requested-With': null,
      }
    })
    await this.osmd.load(scoreXml.data);
    this.scoreLoading = false;
    await this.$nextTick();
    this.osmd.zoom = 1.5
    await this.osmd.render();
  }
}
</script>

<style>
</style>

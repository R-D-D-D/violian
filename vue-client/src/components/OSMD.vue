<template lang="pug">
  #score
    div.ma-0#score(ref="scorediv" v-show="!scoreLoading" style="height:130px; overflow:hidden;")

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
      osmd: null,
      from: 1,
      to: 2
    }
  },
 
  methods: {
    async changeBars () {
      this.from += 2
      this.to += 2
      this.osmd.setOptions({
        drawFromMeasureNumber: this.from,
        drawUpToMeasureNumber: this.to
      })
      await this.osmd.render()
      console.log(this.osmd.GraphicSheet.measureList.map(measure => measure[0].boundingBox))

    }
  },

  mounted: async function () {
    this.osmd = new OpenSheetMusicDisplay(
      this.$refs.scorediv, 
      {
        drawFromMeasureNumber: 1,
        drawUpToMeasureNumber: 2,
        fillEmptyMeasuresWithWholeRest: true,
        drawComposer: false,
        drawTitle: false,
        renderSingleHorizontalStaffline: true,
        drawPartNames: false,
        autoResize: true,
        drawMetronomeMarks: false,
        // backend: 'Canvas',
        drawingParameters: 'compacttight'
      }
    )
    // this.osmd.setCustomPageFormat({
    //   width: 1000,
    //   height: 300
    // })
    // this.osmd.setCustomPageFormat(1000)
    this.scoreLoading = true;
    let scoreXml = await axios.get("https://rhythm-academy.s3-ap-southeast-1.amazonaws.com/twinkle-twinkle-little-star.musicxml");    
    // let scoreXml = await axios.get("https://opensheetmusicdisplay.github.io/demo/sheets/MuzioClementi_SonatinaOpus36No3_Part1.xml");

    await this.osmd.load(scoreXml.data);
    this.scoreLoading = false;
    await this.$nextTick();
    // this.osmd.zoom = 1.3
    // this.osmd.setCustomPageFormat(1, .3)
    await this.osmd.render();

    console.log(this.osmd.graphic.musicPages[0].boundingBox)
    console.log(this.osmd.GraphicSheet.measureList.map(measure => measure[0].boundingBox))
  }
}
</script>

<style>
</style>

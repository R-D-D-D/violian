/* eslint-disable */
<template lang="pug">
  #score
    //- div.ma-0#score(ref="scorediv" v-show="!scoreLoading" style="height:130px; overflow:hidden;")
    div.ma-0#score(ref="scorediv" v-show="!scoreLoading" style="height:220px; width:1000px;")

    v-btn(@click="changeBars") Change Bars
</template>

<script>
/* eslint-disable */
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
      console.log(this.osmd.graphic)
      await this.osmd.render()
      console.log(this.osmd.graphic)
      // console.log(this.osmd.graphic.musicPages[0].boundingBox)

      // console.log(this.osmd.GraphicSheet.measureList.map(measure => measure[0].boundingBox))

    }
  },

  mounted: async function () {
    OpenSheetMusicDisplay.prototype.preCalculate = function () {
        if (!this.graphic) {
            throw new Error("OpenSheetMusicDisplay: Before rendering a music sheet, please load a MusicXML file");
        }
        if (this.drawer) {
            this.drawer.clear(); // clear canvas before setting width
        }
        // musicSheetCalculator.clearSystemsAndMeasures() // maybe? don't have reference though
        // musicSheetCalculator.clearRecreatedObjects();

        // Set page width
        let width = this.container.offsetWidth;
        if (this.rules.RenderSingleHorizontalStaffline) {
            width = 32767; // set safe maximum (browser limit), will be reduced later
            // reduced later in MusicSheetCalculator.calculatePageLabels (sets sheet.pageWidth to page.PositionAndShape.Size.width before labels)
            // rough calculation:
            // width = 600 * this.sheet.SourceMeasures.length;
        }
        console.log("[OSMD] render width: " + width);

        this.sheet.pageWidth = width / this.zoom / 10.0;
        if (this.rules.PageFormat && !this.rules.PageFormat.IsUndefined) {
            this.rules.PageHeight = this.sheet.pageWidth / this.rules.PageFormat.aspectRatio;
            console.log("[OSMD] PageHeight: " + this.rules.PageHeight);
        } else {
            console.log("[OSMD] endless/undefined pageformat, id: " + this.rules.PageFormat.idString);
            this.rules.PageHeight = 100001; // infinite page height // TODO maybe Number.MAX_VALUE or Math.pow(10, 20)?
        }

        // Before introducing the following optimization (maybe irrelevant), tests
        // have to be modified to ensure that width is > 0 when executed
        //if (isNaN(width) || width === 0) {
        //    return;
        //}

        // Calculate again
        this.graphic.reCalculate();

        if (this.drawingParameters.drawCursors) {
            this.graphic.Cursors.length = 0;
        }

        // needBackendUpdate is well intentioned, but we need to cover all cases.
        //   backends also need an update when this.zoom was set from outside, which unfortunately doesn't have a setter method to set this in.
        //   so just for compatibility, we need to assume users set osmd.zoom, so we'd need to check whether it was changed compared to last time.
        if (true || this.needBackendUpdate) {
            this.createOrRefreshRenderBackend();
            this.needBackendUpdate = false;
        }

        this.drawer.setZoom(this.zoom);
        // Finally, draw
        this.drawer.drawSheet(this.graphic);

        this.enableOrDisableCursor(this.drawingParameters.drawCursors);

        if (this.drawingParameters.drawCursors && this.cursor) {
            // Update the cursor position
            this.cursor.update();
        }
        this.zoomUpdated = false;
    }
    this.osmd = new OpenSheetMusicDisplay(
      this.$refs.scorediv, 
      {
        // drawFromMeasureNumber: 1,
        // drawUpToMeasureNumber: 2,
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
    // let scoreXml = await axios.get("https://rhythm-academy.s3-ap-southeast-1.amazonaws.com/twinkle-twinkle-little-star.musicxml");    
    let scoreXml = await axios.get("https://opensheetmusicdisplay.github.io/demo/sheets/MuzioClementi_SonatinaOpus36No3_Part1.xml");

    await this.osmd.load(scoreXml.data);
    this.scoreLoading = false;
    await this.$nextTick();
    // this.osmd.zoom = 1.3
    // this.osmd.setCustomPageFormat(1, .3)
    console.log(this.osmd.graphic)
    // await this.osmd.render();
    await this.osmd.preCalculate()
    console.log(this.osmd.graphic)
    // console.log(this.osmd.drawer) 

    // console.log(this.osmd.graphic.musicPages[0].boundingBox)
    // console.log(this.osmd.GraphicSheet.measureList.map(measure => measure[0].boundingBox))
  }
}
</script>

<style>
</style>

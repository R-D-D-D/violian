<template lang="pug">
  #vex
    #vexflow-wrapper
</template>

<script>
import tone from '@/plugins/tone'
import vexUI from '@/plugins/vex'

export default {
  name: 'VexFlowUI',
  data () {
    return {
      handler: {}
    }
  },
  mounted: function () {
    this.handler = new vexUI.UI.Handler("vexflow-wrapper").init();
  }
}
</script>

<style>
</style>

<template lang="pug">
  div 
    v-container
      v-row
        v-col
          v-form
            v-row
              v-col(cols="4")
                v-file-input(
                  accept="video/mp4, video/ogg" 
                  placeholder="Choose Explanation Video" 
                  prepend-icon="mdi-video" 
                  label="Explanation Video"
                  v-model="video")
              v-col(cols="4")
                div#wrapper
                  v-progress-linear(:value='progress' height='10' striped rounded :color="color")

            v-btn(@click="submit") Submit
      
      v-row
        v-col(cols="4")
          video(:src="src" style="width:100%" controls)
      v-row
        v-col
          v-btn(@click="startTimer") Start Timer
          v-btn(@click="reset") Reset
</template>

<script>
import AWS from 'aws-sdk'

export default {
name: "VideoPlayer",
    data() {
      return {
        video: null,
        progress: 0,
        value: '',
        custom: true,
        src: '',
        error: false
      }
    },

    computed: {
      color () {
        if (this.progress == 100) {
          return 'success'
        } else if (!this.error) {
          return 'primary'
        } else {
          return 'error'
        }
      } 
    },

    watch: {
      video: function (val) {
        console.log(val)
        this.src = URL.createObjectURL(val)
      }
    },

    methods: {
      startTimer () {
        setInterval (() => {
          if (this.progress < 100) {
            this.progress += 10
          }
        }, 1000)
      },

      reset () {
        this.progress = 0
      },
      
      async submit () {
        AWS.config.update({
          accessKeyId : process.env.VUE_APP_AWS_ACCESS_KEY,
          secretAccessKey : process.env.VUE_APP_AWS_SECRET_ACCESS_KEY
        });
        AWS.config.region = 'ap-southeast-1'

        try {
          let upload = new AWS.S3.ManagedUpload({
            partSize: 10 * 1024 * 1024,
            params: {
              Bucket: process.env.VUE_APP_BUCKET_NAME,
              Key: `testingmultipart/${this.video.name}`,
              Body: this.video
            }
          })
          upload.on('httpUploadProgress', (evt) => {
            this.progress = parseInt((evt.loaded * 100) / evt.total)
          })
          await upload.promise()
          // upload.send()
          console.log(upload)
        } catch (err) {
          console.log(err)
          this.error = true
        }
        // const s3 = new AWS.S3({
        //   accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
        //   secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
        //   region: 'ap-southeast-1'
        // });

        // let params = {
        //     Bucket: process.env.VUE_APP_BUCKET_NAME,
        //     Key: `testingmultipart/${this.video.name}`,
        //     Body: this.video
        // }
    
        // // Uploading files to the bucket
        // await s3.upload(params).promise()
      }
    },
    mounted() {
      console.log(process.env)

    }
}
</script>

<style scoped>
#vexflow-wrapper {
  position: absolute;
  background-color: #FAFAFA;
  top: 0;
  left: 0;
  right: 0;
}

#wrapper {
  display: flex;
  /* margin: 0 auto; */
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>

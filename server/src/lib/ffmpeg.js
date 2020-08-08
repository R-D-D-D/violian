const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async createVideoWithResolution (pathToVid, resolution) {
    const pathObj = path.parse(pathToVid);
    // let bitrate = '1500k';
    let finalRes = resolution
    // switch (resolution) {
    //   case '1280x720':
    //     bitrate = '1500k'
    //     break
    //   case '854x480':
    //     bitrate = '750k'
    //     finalRes = '640x?'
    //     break
    // }

    await new Promise((resolve, reject) => {
      ffmpeg(pathToVid)
        .noAudio()
        // .aspect('16:9')
        .size(finalRes)
        .autopad()
        .toFormat('mp4')
        .videoCodec('libx264')
        .output(`${pathObj.dir}/${pathObj.name}${resolution.split('x')[1]}_video.mp4`)
        .on('progress', (progress) => {
          console.log(progress)
        })
        .on('error', (err) => {
          console.log(`[ffmpeg] error: ${err.message}`)
          reject(err);
        })
        .on('end', () => {
          console.log('[ffmpeg] finished')
          resolve();
        })
        .run()
    });
  },

  async createAudio (pathToVid) {
    const pathObj = path.parse(pathToVid)
    await new Promise((resolve, reject) => {
      ffmpeg(pathToVid)
        .noVideo()
        .toFormat('mp4')
        .output(`${pathObj.dir}/${pathObj.name}_audio.mp4`)
        .on('progress', (progress) => {
          console.log(progress)
        })
        .on('error', (err) => {
          console.log(`[ffmpeg] error: ${err.message}`)
          reject(err);
        })
        .on('end', () => {
          console.log('[ffmpeg] finished')
          resolve();
        })
        .run()
    });
  },

  async createDashManifest (pathToVid) {
    const { stdout, stderr } = await exec(`packager \
      input=src/scripts/src/sample720_video.mp4,stream=video,output=dest/sample720_video.mp4 \
      input=src/scripts/src/sample360_video.mp4,stream=video,output=dest/sample480_video.mp4 \
      input=src/scripts/src/sample_audio.mp4,stream=audio,output=dest/sample_audio.mp4 \
      --profile on-demand \
      --mpd_output dest/sample-manifest-full.mpd \
      --min_buffer_time 3 \
      --segment_duration 3`);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  },

  async getMetaData (pathToVid) {
    let metadata = {}
    await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(pathToVid, function(err, meta) {
        if (err) {
          reject(err)
        } else {
          metadata = meta
          resolve()
        }
      });
    });
    return metadata
  }
}
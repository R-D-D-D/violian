const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async createVideoWithResolution (pathToVid, height) {
    const pathObj = path.parse(pathToVid)
    const outputPath = `${pathObj.dir}/${pathObj.name}${height}_video.mp4`

    await new Promise((resolve, reject) => {
      ffmpeg(pathToVid)
        .noAudio()
        .aspect('16:9')
        .size(`?x${height}`)
        .autopad()
        .toFormat('mp4')
        .videoCodec('libx264')
        .output(outputPath)
        .on('progress', (progress) => {
          // console.log(progress)
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
    const outputPath = `${pathObj.dir}/${pathObj.name}_audio.mp4`

    await new Promise((resolve, reject) => {
      ffmpeg(pathToVid)
        .noVideo()
        .toFormat('mp4')
        .output(outputPath)
        .on('progress', (progress) => {
          console.log(progress)
        })
        .on('error', (err) => {
          console.log(`[ffmpeg] error: ${err.message}`)
          reject(err)
        })
        .on('end', () => {
          console.log('[ffmpeg] finished')
          resolve()
        })
        .run()
    })
  },

  async createDashManifest (pathToVid, height, audio) {
    const pathObj = path.parse(pathToVid)
    let destFiles = []
    console.log(pathObj)

    let command = 'packager '
    while (height > 0) {
      command += `input=${pathObj.dir}/${pathObj.name}${height}_video.mp4,stream=video,output=${pathObj.dir}/../dest/${pathObj.name}${height}_video.mp4 `
      destFiles.push(path.normalize(`${pathObj.dir}/../dest/${pathObj.name}${height}_video.mp4`))
      height -= 360
    }

    if (audio) {
      command += `input=${pathObj.dir}/${pathObj.name}_audio.mp4,stream=audio,output=${pathObj.dir}/../dest/${pathObj.name}_audio.mp4 `
      destFiles.push(path.normalize(`${pathObj.dir}/../dest/${pathObj.name}_audio.mp4`))
    }

    command += `--profile on-demand \
      --mpd_output ${pathObj.dir}/../dest/${pathObj.name}-manifest-full.mpd \
      --min_buffer_time 3 \
      --segment_duration 3`

    console.log(command)
    destFiles.push(path.normalize(`${pathObj.dir}/../dest/${pathObj.name}-manifest-full.mpd`))

    const { stdout, stderr } = await exec(command);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    return destFiles
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
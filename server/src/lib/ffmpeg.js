const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')


module.exports = {

  async changeVideoResolution (pathToVid, resolution) {
    const pathObj = path.parse(pathToVid);
    const bitrate = 10;
    const promise = new Promise((resolve, reject) => {
      ffmpeg(pathToVid)
        .noAudio()
        .size(resolution)
        .toFormat('mp4')
        .videoCodec('libx264')
        .output(`${pathObj.dir}/${pathObj.name}_${resolution.split('x')[1]}${pathObj.ext}`)
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

    await promise
  },

  getAudio (pathToVid) {
    var command = ffmpeg('/path/to/file.avi').audioBitrate('128k').noVideo()
  }
}
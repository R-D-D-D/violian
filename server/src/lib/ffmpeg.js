const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')


module.exports = {

  promisifyCommand (command) {
    return Promise.promisify((cb) => {
      command
        .on( 'end',   ()      => { cb(null)  } )
        .on( 'error', (error) => { cb(error) } )
        .run()
    })
  },

  async changeVideoResolution (pathToVid, resolution) {
    const pathObj = path.parse(pathToVid);
    console.log(pathObj)
    var stream  = fs.createWriteStream(`${pathObj.dir}/${pathObj.name}_${resolution.split('x')[1]}${pathObj.ext}`);
    let command = ffmpeg(path)
      .noAudio()
      .size(resolution)
      .output(`${pathObj.dir}/${pathObj.name}_${resolution.split('x')[1]}${pathObj.ext}`)

    command = this.promisifyCommand(command)
    await command()
  },

  getAudio (pathToVid) {
    var command = ffmpeg('/path/to/file.avi').audioBitrate('128k').noVideo()
  }
}
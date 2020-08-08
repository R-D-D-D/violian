const AWS = require('aws-sdk')
const config = require('../config/config')
const ffmpeg = require('../lib/ffmpeg')
const fs = require('fs')
const path = require('path')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
      if (req.file) {
        var srcDir = '/Users/rundingwang/Documents/Github/node-learning/server/src/scripts/src/';
        var destDir = '/Users/rundingwang/Documents/Github/node-learning/server/src/scripts/dest/';

        if (!fs.existsSync(srcDir)){
            fs.mkdirSync(srcDir);
        }

        fs.writeFileSync(srcDir + req.file.originalname, req.file.buffer);
        let metadata = await ffmpeg.getMetaData(srcDir + req.file.originalname)
        console.log(metadata)
        let videoHeight = metadata.streams[0].height
        let videoAspectRatio = metadata.streams[0].display_aspect_ratio

        // await ffmpeg.createVideoWithResolution(srcDir + req.file.originalname, '1280x720')
        await ffmpeg.createVideoWithResolution(srcDir + req.file.originalname, '640x360')
        await ffmpeg.createAudio(srcDir + req.file.originalname)
        // await ffmpeg.createDashManifest(srcDir + req.file.originalname)

        // fs.rmdirSync(srcDir)
        // fs.rmdirSync(destDir)
      }

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the file'
      })
    }
  },

  async test (req, res) {
    try {
      
      fs.writeFileSync(`/home/runding/Documents/${req.file.originalname}`, req.file.buffer);

      await ffmpeg.changeVideoResolution(`/home/runding/Documents/${req.file.originalname}`, '640x360')

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the file'
      })
    }
  }

}
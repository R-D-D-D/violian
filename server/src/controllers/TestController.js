const AWS = require('aws-sdk')
const config = require('../config/config')
const ffmpeg = require('../lib/ffmpeg')
const fs = require('fs')
const path = require('path')
const aws = require('../lib/aws')
const {Lesson} = require('../models')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
})

module.exports = {
  async create (req, res) {
    try {
      if (req.file) {
        const srcDir = path.join(__dirname, `/../tmp/${req.user.email}/src/`)
        const destDir = path.join(__dirname, `/../tmp/${req.user.email}/dest/`)
        const lesson = await Lesson.findOne({
          where: {
            id: req.body.lessonId
          },
          include: 'Course'
        })

        if (!fs.existsSync(srcDir)){
          fs.mkdirSync(srcDir, { recursive: true });
        }

        if (!fs.existsSync(destDir)){
          fs.mkdirSync(destDir, { recursive: true });
        }

        fs.writeFileSync(srcDir + req.file.originalname, req.file.buffer);
        let metadata = await ffmpeg.getMetaData(srcDir + req.file.originalname)

        // retrieve the stream info from metadata
        let videoStream = metadata.streams.find(stream => stream.codec_type == 'video')
        let audioStream = metadata.streams.find(stream => stream.codec_type == 'audio')

        if (!videoStream) {
          return res.status(403).send({
            error: 'The input file is not a video'
          })
        }

        // process video
        let videoHeight = videoStream.height
        if (videoHeight == 1080) {
          videoHeight = 1080
        } else if (videoHeight >= 720 && videoHeight < 1080) {
          videoHeight = 720
        } else if (videoHeight >= 360 && videoHeight < 720) {
          videoHeight = 360
        } else {
          videoHeight = null
        }

        let counter = videoHeight
        while (counter != null && counter > 0) {
          await ffmpeg.createVideoWithResolution(srcDir + req.file.originalname, counter)
          counter -= 360
        }
        
        // process audio
        if (audioStream)
          await ffmpeg.createAudio(srcDir + req.file.originalname)

        // create mpd file for mpeg dash
        let filesToBeUploaded = (await ffmpeg.createDashManifest(srcDir + req.file.originalname, videoHeight,audioStream))
        
        console.log(filesToBeUploaded)
        filesToBeUploaded.forEach(async filePath => {
          let filenameObj = path.parse(filePath)
          await aws.managedUploadFromLocalFs(filePath, `${req.user.email}/${lesson.Course.name}/${lesson.name}/mpeg_dash_videos/${filenameObj.base}`)
        })

        fs.rmdirSync(srcDir, {
          recursive: true
        })
        fs.rmdirSync(destDir, {
          recursive: true
        })
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
}
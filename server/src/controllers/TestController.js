const AWS = require('aws-sdk')
const config = require('../config/config')
const ffmpeg = require('../lib/ffmpeg')
const fs = require('fs')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
      // if (req.file) {
      //   fs.writeFileSync(`/home/runding/Documents/${req.file.originalname}`, req.file.buffer);
      // } else {
      //   fs.writeFileSync(`/home/runding/Documents/test.txt`, 'Hey yo');
      // }

      ffmpeg.changeVideoResolution(`/home/runding/Documents/${req.file.originalname}`, '854x480')

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
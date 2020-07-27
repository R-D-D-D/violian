const {Exercise} = require('../models')
const {Post} = require('../models')
const {Thread} = require('../models')
const AWS = require('aws-sdk')
const mailgun = require('../lib/mailgun')

const config = require('../config/config')

const s3 = new AWS.S3({
  accessKeyId: config.aws.id,
  secretAccessKey: config.aws.secret
});

module.exports = {
  async create (req, res) {
    try {
      const user = req.user
      const {tid} = req.body
      const thread = await Thread.findOne({
        where: {
          id: tid
        }
      })
      
      if (!thread) {
        return res.status(403).send({
          error: "Thread information is incorrect"
        })
      }

      const course = await thread.getCourse()
      if (thread.UserId != user.id && course.TutorId != user.id) {
        return res.status(403).send({
          error: 'you do not have access to this resource'
        })
      }

      if (req.file) {
        var params = {
            Bucket: config.aws.bucket,
            Key: `${user.email}/post/${tid}/${req.file.originalname}`,
            Body: req.file.buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        req.body.videoUrl = response.Location
      }

      const post = await thread.createPost(req.body)
      await post.setUser(user)

      if (user.isStudent) {
        await thread.increment('unreadStudentPost', { by: 1})
        await course.increment('unreadStudentPost', { by: 1})
      } else {
        await thread.increment('unreadTutorPost', { by: 1})
        await course.increment('unreadTutorPost', { by: 1})
      }


      if (user.isStudent) {
        const course = await thread.getCourse()
        const tutor = await course.getTutor()
 
        await mailgun.sendNotification(course, user, tutor)
      }

      res.send({
        post: post.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the post'
      })
    }
  },

  async edit (req, res) {
    try {
      const postObj = req.body
      const post = await Post.findOne({
        where: {
          id: postObj.id
        }
      })
      const thread = await post.getThread()
      
      if (!post) {
        res.status(403).send({
          error: "Post information incorrect"
        })
      }

      if (thread.UserId != req.user.id) {
        return res.status(403).send({
          error: 'you do not have access to this resource'
        })
      }

      if (req.file && post.videoUrl) {
        // delete the previous video
        var originalKeys = post.videoUrl.split('/')
        var deleteParams = {
          Bucket: config.aws.bucket,
          Key: `${req.user.email}/post/${post.ThreadId}/${originalKeys[originalKeys.length - 1]}`
        }

        await s3.deleteObject(deleteParams).promise()

        var params = {
          Bucket: config.aws.bucket,
          Key: `${req.user.email}/post/${thread.id}/${req.file.originalname}`,
          Body: req.file.buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        postObj.videoUrl = response.Location
      } else if (req.file) {
        var params = {
          Bucket: config.aws.bucket,
          Key: `${req.user.email}/post/${thread.id}/${req.file.originalname}`,
          Body: req.file.buffer
        }
    
        // Uploading files to the bucket
        const response = await s3.upload(params).promise()
        postObj.videoUrl = response.Location
      }

      Object.assign(post, postObj)
      await post.save()

      res.send({
        post: post.toJSON()
      })

    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to edit post"
      })
    }
  },

  async list (req, res) {
    try {
      const {tid} = req.query

      const thread = await Thread.findOne({
        where: {
          id: tid
        }
      })
      
      if (!thread) {
        return res.status(403).send({
          error: "Thread information is incorrect"
        })
      }

      var posts = await thread.getPosts()
      
      const postsJson = []
      posts.forEach(post => {
        postsJson.push(post.toJSON())
      })
      // console.log(postsJson)
      res.send({
        posts: postsJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve posts"
      })
    }
  },

  async destroy (req, res) {
    try {
      const {pid} = req.query
      const post = await Post.findOne({
        where: {
          id: pid
        }
      })

      const thread = await post.getThread()
      if (post.UserId != req.user.id) {
        return res.status(403).send({
          error: 'you do not have access to this resource'
        })
      }


      if (post.videoUrl) {
        let deleteParams = {
          Bucket: config.aws.bucket,
          Key: `${req.user.email}/post/${post.ThreadId}/${post.videoUrl.split(`post/${post.ThreadId}/`)[1]}`
        }
        await s3.deleteObject(deleteParams).promise()
      }

      await post.destroy()
      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete post"
      })
    }
  },

  async mail (req, res) {
    try {
      await mailgun.sendNotification()
      res.send({
        data: 'ok'
      })
    } catch {
      res.status(500).send({
        error: 'an error has occured trying to create the post'
      })
    }
    await mailgun.sendNotification()
  }
}
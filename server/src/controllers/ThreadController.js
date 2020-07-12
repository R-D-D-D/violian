const {Lesson} = require('../models')
const {Course} = require('../models')
const {Thread} = require('../models')

module.exports = {
  async create (req, res) {
    try {
      const user = req.user
      const {lid} = req.body
      const lesson = await Lesson.findOne({
        where: {
          id: lid
        }
      })
      
      if (!lesson) {
        return res.status(403).send({
          error: "Lesson information is incorrect"
        })
      }

      const thread = await lesson.createThread()
      await thread.setUser(user)
      await thread.setCourse(lesson.CourseId)

      res.send({
        thread: thread.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the thread'
      })
    }
  },

  async show (req, res) {
    try {
      var {lid} = req.query
      var {uid} = req.query
      const thread = await Thread.findOne({
        where: {
          UserId: uid,
          LessonId: lid
        }
      })
      console.log(lid)
      console.log(uid)
      
      if (!thread) {
        return res.send({
          thread: {}
        })
      }
      
      var threadJson = thread.toJSON()
      var posts = await thread.getPosts()
      console.log(posts)
      threadJson.posts = posts.map(post => post.toJSON())

      // console.log(ThreadsJson)
      res.send({
        thread: threadJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve thread"
      })
    }
  },

  async list (req, res) {
    try {
      var threads = null
      if (req.query.lid) {
        const lesson = await Lesson.findOne({
          where: {
            id: req.query.lid
          }
        })
        if (!lesson) {
          return res.status(403).send({
            error: "Lesson information provided is incorrect"
          })
        }
        threads = await lesson.getThreads()
      } else {
        threads = await req.user.getThreads()
      }
      
      if (!threads) {
        return res.send({
          threads: []
        })
      }
      
      const threadsJson = []
      threads.forEach(thread => {
        threadsJson.push(thread.toJSON())
      })
      // console.log(ThreadsJson)
      res.send({
        threads: threadsJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve threads"
      })
    }
  },

  async destroy (req, res) {
    try {
      const {tid} = req.query
      await Thread.destroy({
        where: {
          id: tid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete thread"
      })
    }
  }
}
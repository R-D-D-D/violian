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

      if (!thread) {
        return res.send({
          thread: {}
        })
      }

      const course = await thread.getCourse()
      if (req.user.isStudent) {
        if (course.unreadTutorPost > 0) {
          await course.decrement('unreadTutorPost', { by: thread.unreadTutorPost })
        } else if (course.unreadTutorPost < 0) {
          course.unreadTutorPost = 0
          await course.save()
        }
        thread.unreadTutorPost = 0
        await thread.save()
      } else {
        if (course.unreadStudentPost > 0) {
          await course.decrement('unreadStudentPost', { by: thread.unreadStudentPost })
        } else if (course.unreadStudentPost < 0) {
          course.unreadStudentPost = 0
          await course.save()
        }
        thread.unreadStudentPost = 0
        await thread.save()
      }
      
      await thread.reload()
      var threadJson = thread.toJSON()
      var posts = await thread.getPosts()
      threadJson.posts = posts.map(post => post.toJSON())

      // console.log(ThreadsJson)
      res.send({
        thread: threadJson
      })
    } catch (err) {
      console.log(err)
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

  async getUnread (req, res) {
    try {
      const {uid} = req.query
      const {cid} = req.query
      const course = await Course.findOne({
        where: {
          id: cid
        },
        include: Lesson
      })

      if (!course) {
        res.status(403).send({
          error: 'Course information incorrect'
        })
      }

      var result = 0

      for (var i = 0; i < course.Lessons.length; i++) {
        var thread = await Thread.findOne({
          where: {
            LessonId: course.Lessons[i].id,
            UserId: uid
          }
        })
        result += thread.unreadStudentPost
      }

      res.send({
        unread: result
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to get unread of thread"
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
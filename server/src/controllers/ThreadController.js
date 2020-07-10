const {Exercise} = require('../models')
const {Thread} = require('../models')
const {User} = require('../models')

module.exports = {
  async create (req, res) {
    try {
      const user = req.user
      const eid = req.body.eid
      const exercise = await Exercise.findOne({
        where: {
          id: eid
        }
      })
      
      if (!exercise) {
        return res.status(403).send({
          error: "Exercise information is incorrect"
        })
      }

      const thread = await exercise.createThread()
      thread.setUser(user)

      res.send({
        thread: thread.toJSON()
      })
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the thread'
      })
    }
  },

  async list (req, res) {
    try {
      if (req.query.uid) {
        const student = await User.findOne({
          where: {
            id: req.query.uid
          }
        })
      } else if (req.query.eid) {
        const exercise = await Exercise.findOne({
          where: {
            id: req.query.eid
          }
        })
      } else {
        throw new Error("Incorrect information provided")
      }

      const course = await Course.findOne({
        where: {
          id: cid
        }
      })
      
      if (!course) {
        return res.status(403).send({
          error: "Course information is incorrect"
        })
      }

      var Threads = await course.getThreads()

      if (!Threads) {
        return res.status(403).send({
          error: "No Thread found"
        })
      }
      
      const ThreadsJson = []
      Threads.forEach(Thread => {
        ThreadsJson.push(Thread.toJSON())
      })
      // console.log(ThreadsJson)
      res.send({
        Threads: ThreadsJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve Threads"
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
const {Lesson} = require('../models')
const {Folder} = require('../models')
const {Exercise} = require('../models')
const {Course} = require('../models')
const {sequelize} = require('../models')

async function deleteDirectoryTree (folder) {
  if (!folder)
    return
  let children = (await folder.getChildren())
  await sequelize.transaction(async (t) => {
    await folder.destroy({
      transaction: t
    })
  })
  if (children.length > 0)
    children.map(async child => await deleteDirectoryTree(child))
}

module.exports = {
  async show (req, res) {
    try {
      const {lid} = req.query

      const lesson = await Lesson.findOne({
        where: {
          id: lid
        },
        include: Exercise
      })
      
      if (!lesson) {
        return res.status(403).send({
          error: "Lesson information is incorrect"
        })
      }

      res.send({
        lesson: lesson.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to retrieve lesson information'
      })
    }
  },

  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {cid} = req.body
        console.log(req.body)

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
  
        const lesson = await course.createLesson(req.body, {
          transaction: t
        })
  
        await course.increment('duration', { 
          by: parseInt(req.body.duration) || 0,
          transaction: t
        })
        await lesson.setCourse(course)
  
        res.send({
          lesson: lesson.toJSON()
        })
      })
    } catch (err) {
      console.log('from lesson', err)
      res.status(500).send({
        error: 'an error has occured trying to create the lesson'
      })
    }
  },

  async edit (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {id} = req.body
        const lesson = await Lesson.findOne({
          where: {
            id: id
          }
        })

        if (!lesson) {
          res.status(403).send({
            error: "Lesson not found"
          })
        }

        const course = await lesson.getCourse()
        var differenceInDuration = parseInt(req.body.duration) - lesson.duration
        if (differenceInDuration != 0) {
          if (differenceInDuration > 0) {
            await course.increment('duration', { 
              by: differenceInDuration,
              transaction: t
            })
          } else {
            await course.decrement('duration', { 
              by: differenceInDuration,
              transaction: t
            })
          }
        }

        await Lesson.update(req.body, {
          where: {
            id: id
          },
          transaction: t
        })
        
        await lesson.reload()
        res.send({
          lesson: lesson.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to edit lesson"
      })
    }
  },

  async list (req, res) {
    try {
      const {cid} = req.query

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

      var lessons = await course.getLessons()

      if (!lessons) {
        return res.status(403).send({
          error: "No lesson found"
        })
      }
      
      const lessonsJson = []
      lessons.forEach(lesson => {
        lessonsJson.push(lesson.toJSON())
      })
      res.send({
        lessons: lessonsJson
      })
    } catch (err) {
      res.status(500).send({
        error: "An error has occured in trying to retrieve lessons"
      })
    }
  },

  async destroy (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {lid} = req.query
        const lesson = await Lesson.findOne({
          where: {
            id: lid
          }
        })

        const course = await lesson.getCourse()
        await course.decrement('duration', { 
          by: lesson.duration,
          transaction: t
        })

        await deleteDirectoryTree((await lesson.getFolder()))

        await Lesson.destroy({
          where: {
            id: lid
          },
          transaction: t
        })
        res.send({
          data: 'ok'
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete lesson"
      })
    }
  }
}
const {Lesson} = require('../models')
const {Folder} = require('../models')
const {sequelize} = require('../models')
const {Course} = require('../models')
const {File} = require('../models')

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {lessonId} = req.body
        let user = req.user

        const lesson = await Lesson.findOne({
          where: {
            id: lessonId
          },
          include: [Course, Folder]
        })
        
        if (!lesson) {
          return res.status(403).send({
            error: "Lesson information is incorrect"
          })
        }

        if (lesson.Course.TutorId != user.id) {
          return res.status(403).send({
            error: "You do not have access to this resource"
          })
        }

        let folder = await lesson.createFolder(req.body, { transaction: t })

        res.send({
          folder: folder.toJSON()
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the folder'
      })
    }
  },

  async show (req, res) {
    try {
      let {fid} = req.query
      let folder = await Folder.findOne({
        where: {
          id: fid
        },
        include: File
      })

      if (!folder) {
        return res.status(403).send({
          error: "Folder information given is incorrect"
        })
      }

      res.send({
        folder: folder.toJSON()
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve folder"
      })
    }
  },

  async list (req, res) {
    try {
      let {lid} = req.query
      let folders = await Folder.findAll({
        where: {
          LessonId: lid
        },
        include: File
      })

      res.send({
        folders: folders.map(folder => folder.toJSON())
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to retrieve folders"
      })
    }
  },

  async destroy (req, res) {
    try {
      const {fid} = req.query

      let folder = await Folder.destroy({
        where: {
          id: fid
        }
      })

      res.send({
        data: 'ok'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: "An error has occured in trying to delete folder"
      })
    }
  }
}
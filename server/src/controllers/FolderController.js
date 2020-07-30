const {Lesson} = require('../models')
const {Folder} = require('../models')
const {sequelize} = require('../models')
const {Course} = require('../models')
const {File} = require('../models')

async function getDirectoryTree (folder) {
  if (!folder)
    return
  let children = (await folder.getChildren())
  let folderJson = folder.toJSON()
  folderJson.Files = (await folder.getFiles()).map(file => file.toJSON())
  if (children.length == 0) {
    return folderJson
  } else {
    folderJson.children = await Promise.all(children.map(async child => await getDirectoryTree(child)))
    return folderJson
  }
}

async function deleteDirectoryTree (folder) {
  if (!folder)
    return
  let children = (await folder.getChildren())
  await sequelize.transaction(async (t) => {
    await folder.destroy({
      transaction: t,
      individualHooks: true
    })
  })
  if (children.length > 0)
    children.map(async child => await deleteDirectoryTree(child))
}

module.exports = {
  async create (req, res) {
    try {
      await sequelize.transaction(async (t) => {
        const {parentId, lessonId} = req.body
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

        console.log(lesson.Folder)
        let folder = null
        if (parentId) {
          let parent = await Folder.findOne({
            where: {
              id: parentId
            }
          })
          req.body.relativePath = `${parent.relativePath}/${req.body.name}`
          folder = await Folder.create(req.body, { transaction: t })
          await folder.addParent(parent, { transaction: t })
          await parent.addChild(folder, { transaction: t })
        } else if (!lesson.Folder) {
          req.body.relativePath = `${lesson.Course.name}/${lesson.name}/Resources`
          req.body.name = 'Resources'
          req.body.isRoot = true
          folder = await lesson.createFolder(req.body, { transaction: t })
        }

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
      let {lid, fid} = req.query
      let folder = null
      if (lid || fid) {
        if (lid) {
          let lesson = await Lesson.findOne({
            where: {
              id: lid
            }
          })
          folder = await lesson.getFolder()
        } else {
          folder = await Folder.findOne({
            where: {
              id: fid
            }
          })
        }
      } else {
        return res.status(403).send({
          error: "Information given is incorrect"
        })
      }

      if (!folder) {
        return res.status(403).send({
          error: "Information given is incorrect"
        })
      }

      let folderJson = null
      folderJson = await getDirectoryTree(folder)

      // console.log(ThreadsJson)
      res.send({
        folder: folderJson
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
      let folders = await Folder.findAll()
      let foldersJson = []
      foldersJson = await Promise.all(folders.map(async folder => {
        let folderJson = folder.toJSON()
        // folder.parents = await folder.getParents()
        // folder.children = await folder.getChildren()
        folderJson.parents = (await folder.getParents()).map(parent => parent.toJSON())
        folderJson.children = (await folder.getChildren()).map(child => child.toJSON())
        foldersJson.push(folderJson)
        return folderJson
      }))
      res.send({
        folders: foldersJson
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
      let folder = await Folder.findOne({
        where: {
          id: fid
        }
      })
      await deleteDirectoryTree(folder)

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
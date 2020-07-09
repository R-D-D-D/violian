module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    message: {
      type: DataTypes.TEXT
    },
    grade: {
      type: DataTypes.INTEGER
    },
    videoUrl: {
      type: DataTypes.STRING
    }
  })

  Post.associate = function (models) {
    Post.belongsTo(models.Thread)
  }
  
  return Post
}
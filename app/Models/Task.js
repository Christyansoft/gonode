'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Task extends Model {
  static boot () {
    super.boot()

    this.addHook('afterCreate', 'TaskHook.sendNewTaskMail')
    this.addHook('beforeUpdate', 'TaskHook.sendNewTaskMail')
  }

  project () {
    return this.belongsTo('App/Models/Project') // declara que a tarefa pertence a um projeto.
  }

  user () {
    return this.belongsTo('App/Models/User') // declara que a tarefa pertence a um usuário
  }

  file () {
    return this.belongsTo('App/Models/File')
  }
}

module.exports = Task

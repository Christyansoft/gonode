'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Project extends Model {
  user () {
    return this.belongsTo('App/Models/User') // declara que o projeto pertence a um usuário
  }

  tasks () {
    return this.hasMany('App/Models/Task') // declara que um projeto pode conter várias tarefas
  }
}

module.exports = Project

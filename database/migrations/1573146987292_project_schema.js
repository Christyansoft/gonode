'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProjectSchema extends Schema {
  up () {
    this.create('projects', (table) => {
      table.increments()
      table
        .integer('user_id') // chave estrangeira da tabela usuario
        .unsigned()
        .references('id') // campo ao qual queremos referenciar
        .inTable('users') // qual tabela queremos referenciar
        .onUpdate('CASCADE') // caso o usuário seja alterado, as alterações serão refletidas
        .onDelete('SET NULL') // caso o usuário seja deletado, este campo será nulo
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('projects')
  }
}

module.exports = ProjectSchema

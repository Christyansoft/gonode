'use strict'

const Role = use('Role')

class RoleController {
  async index () {
    const roles = await Role.query() // faz uma query trazendo as roles com o relacionamento com as permissions
      .with('permissions')
      .fetch()

    return roles
  }

  async show ({ params }) {
    const role = await Role.findOrFail(params.id) // busca a role no banco

    await role.load('permissions') // traz as permissions que possui no relacionamento

    return role
  }

  async store ({ request }) {
    const { permissions, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permissions'
    ])

    const role = await Role.create(data) // cria a role no banco

    if (permissions) { // verifica se o usuário passou o array de permissions na requisição
      await role.permissions().attach(permissions) // insere as varias permissions na role, permission e role já possui relacionamento nativo do adonis
    }

    await role.load('permissions') // carrega as permissions que foram atribuidas à role

    return role
  }

  async update ({ request, params }) {
    const { permissions, ...data } = request.only([
      'name',
      'slug',
      'description',
      'permissions'
    ])

    const role = await Role.findOrFail(params.id) // busca a role no banco

    role.merge(data) // mescla os dados

    await role.save() // salva no banco

    if (permissions) {
      await role.permissions().sync(permissions) // remove as permissions antigas e adiciona as novas
    }

    await role.load('permissions') // carrega as permissions atribuidas novamente

    return role
  }

  async destroy ({ params }) {
    const role = await Role.findOrFail(params.id) // busca a role no banco

    await role.delete() // faz o delete
  }
}

module.exports = RoleController

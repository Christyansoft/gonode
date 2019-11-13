'use strict'

const User = use('App/Models/User')
const UserAddress = use('App/Models/UserAddress')
const Database = use('Database')

class UserController {
  async index ({ request }) {
    const users = await User.query()
      .with('user_adresses')
      .fetch()

    return users
  }

  async store ({ request }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const addresses = request.input('adresses')

    const tx = await Database.beginTransaction()

    const user = await User.create(data, tx)

    await user.addresses().create(addresses, tx)

    tx.commit()

    if (roles) {
      await user.roles().attach(roles)
    }

    if (permissions) {
      await user.permissions().attach(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    return user
  }

  async update ({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const user = await User.findOrFail(params.id)

    user.merge(data)

    await user.save()

    const ad = request.only('adresses')
    // pega o ad
    const adresses = await UserAddress.query()
      .where('user_id', params.id)
      .first()
    // pega o objeto
    adresses.merge(ad.adresses)
    // mescla objeto + ad -> pegando o adress
    await adresses.save()

    if (roles) {
      await user.roles().sync(roles)
    }

    if (permissions) {
      await user.permissions().sync(permissions)
    }

    await user.loadMany(['roles', 'permissions'])

    return adresses
  }
}

module.exports = UserController

'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email') // pega o e-mail vindo da requisição
      const user = await User.findByOrFail('email', email) // faz uma busca no banco pelo email

      user.token = crypto.randomBytes(10).toString('hex') // insere um token de recuperação de senha neste usuario.
      user.token_created_at = new Date()

      await user.save() // salva o usuário com as alterações feitas.

      await Mail.send( // envia e-mail
        ['emails.forgot_password'], // template do e-mail
        { // parâmetros
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('christyansoftperes@gmail.com', 'Cristian | Trixx')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response.status(err.status) // retorna uma mensagem de erro caso ocorra algum erro.
        .send({ error: { message: 'Algo não deu certo, este e-mail existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Seu token foi expirado, por favor solicite um novo' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Algo deu errado ao resetar sua senha' } })
    }
  }
}

module.exports = ForgotPasswordController

'use strict'

class SessionController {
  async store ({ request, response, auth }) {
    const { email, password } = request.all() // pega todos os dados da requisição

    const token = await auth.attempt(email, password) // faz a autenticação e retorna o token de login.

    return token
  }
}

module.exports = SessionController

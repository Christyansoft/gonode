'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

class NewTaskMail {
  static get concurrency () { // determina quantos jobs deseja processar simultaneamente
    return 1
  }

  static get key () {
    return 'NewTaskMail-job' // chave única para cada aplicaçãok, gerada automaticamente
  }

  async handle ({ email, username, title, file }) { // lógica para enviar o email
    console.log(`Job: ${NewTaskMail.key}`)
    await Mail.send(
      ['emails.new_task'],
      { username, title, hasAttachment: !!file },
      message => {
        message
          .to(email)
          .from('christyansoftperes@gmail.com', 'Cristian | Trixx')
          .subject('Nova tarefa para você')

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name
          })
        }
      }
    )
  }
}

module.exports = NewTaskMail

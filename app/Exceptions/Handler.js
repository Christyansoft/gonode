'use strict'

// const Sentry = require('@sentry/node')

const BaseExceptionHandler = use('BaseExceptionHandler')
const Env = use('Env')
const Youch = use('youch')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (Env.get('NODE_ENV') === 'development') {
      const youch = new Youch(error, request.request)
      const errorJSON = await youch.toJSON()
      return response.status(error.status).send(errorJSON)
    }

    return response.status(error.status)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report (error, { request }) {
  //   Sentry.init({ dsn: 'https://5900292d77d24bee90e870e3599b8774@sentry.io/1814134' }) // configuração do sentry
  //   Sentry.captureException(error) // captura de exceções
  // }
}

module.exports = ExceptionHandler

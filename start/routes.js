'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.put('users/:id', 'UserController.update')
Route.get('users', 'UserController.index')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('passwords', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('/files/:id', 'FileController.show')

Route.post('/files', 'FileController.store')

// Route.resource('projects', 'ProjectController')
//   .apiOnly()
//   .validator(new Map([[['projects.store'], ['Project']]]))

// Route.resource('projects.tasks', 'TaskController')
//   .apiOnly()
//   .validator(new Map([[['projects.tasks.store'], ['Task']]])) // passa no validator
//   //    .except(['index', 'show']) // cria uma excessão onde se deseja que tal usuario tenha acesso
//   .middleware(['auth']) // verifica se o usuario é admin ou moderator.

Route.get('projects/:project_id/task/:id', 'TaskController.show')
  .middleware(['auth', 'can:read_tasks'])

Route.get('projects/:project_id', 'TaskController.index')
  .middleware(['auth', 'can:index_tasks'])

Route.delete('tasks/:id', 'TaskController.destroy')
  .middleware(['auth', 'can:delete_tasks'])

Route.put('tasks/:id', 'TaskController.update')
  .middleware(['auth', 'is:(administrator)'])

Route.resource('permissions', 'PermissionController')
  .apiOnly()
  .middleware('auth')

Route.resource('roles', 'RoleController')
  .apiOnly()
  .middleware('auth')

'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User')
Route.put('users/:id', 'UserController.update')
Route.post('sessions', 'SessionController.store').validator('Session')

Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('passwords', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('/files/:id', 'FileController.show')

Route.group(() => {
  Route.post('/files', 'FileController.store')

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map([[['projects.store'], ['Project']]]))

  Route.resource('projects.tasks', 'TaskController')
    .apiOnly()
    .validator(new Map([[['projects.tasks.store'], ['Task']]])) // passa no validator
  //    .except(['index', 'show']) // cria uma excessão onde se deseja que tal usuario tenha acesso
    .middleware(['auth', 'is:(administrator']) // verifica se o usuario é admin ou moderator.
})

// Route.get('projects/:project_id/tasks/:id', 'TaskController.index')
//   .middleware(['auth', 'can:read_tasks'])

// Route.get('projects/:id/tasks', 'TaskController.show')
//   .middleware(['auth', 'can:read_tasks'])

Route.resource('permissions', 'PermissionController')
  .apiOnly()
  .middleware('auth')

Route.resource('roles', 'RoleController')
  .apiOnly()
  .middleware('auth')

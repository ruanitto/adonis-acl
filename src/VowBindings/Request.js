const toArray = require('lodash/toArray')

module.exports = function (Request) {
  Request.macro('addRoles', function () {
    this._roles = toArray(arguments)
    return this
  })

  Request.macro('addPermissions', function () {
    this._permissions = toArray(arguments)
    return this
  })

  Request.before(async (requestInstance) => {
    if (requestInstance._loginArgs) {
      const [user] = requestInstance._loginArgs.options
      if (requestInstance._roles) {
        await user.roles().attach(requestInstance._roles.map(role => role.id))
      }

      if (requestInstance._permissions) {
        await user.permissions().attach(requestInstance._permissions.map(permission => permission.id))
      }
    }
  })
}

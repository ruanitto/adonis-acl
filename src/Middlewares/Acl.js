'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */
const Acl = require('../Acl')
const ForbiddenException = require('../Exceptions/ForbiddenException')

class AclMiddleware {
  async handle ({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }

    const roles = await auth.user.getRoles()
    const permissions = await auth.user.getPermissions()

    const acl = Acl.checkAdvanced(expression, roles, permissions)

    if (!acl) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = AclMiddleware

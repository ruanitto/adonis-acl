'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const Acl = require('../Acl')
const ForbiddenException = require('../Exceptions/ForbiddenException')

class Scope {
  async handle ({ auth }, next, ...requiredScope) {
    if (Array.isArray(requiredScope[0])) {
      requiredScope = requiredScope[0]
    }

    const isAllowed = await Acl.validateScope(requiredScope, auth.user.preFetchedPermissions)
    if (!isAllowed) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Scope

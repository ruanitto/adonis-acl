'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')
const ForbiddenException = require('../Exceptions/ForbiddenException')

class Is {
  async handle ({ auth }, next, ...args) {
    let expression = args[0]
    if (Array.isArray(expression)) {
      expression = expression[0]
    }

    let is = auth.user.is
    if (auth.user.preFetchedRoles) {
      is = Acl.check(expression, operand => _.includes(auth.user.preFetchedRoles, operand))
    } else {
      is = await auth.user.is(expression)
    }
    if (!is) {
      throw new ForbiddenException()
    }

    await next()
  }
}

module.exports = Is

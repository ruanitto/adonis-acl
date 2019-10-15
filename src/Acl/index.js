'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const { check } = require('acler')

const Acl = exports = module.exports = {}

Acl.check = check

const normalizeExpression = (keys, tag, expression) => {
  let newExpression = expression
  keys.forEach((key) => {
    newExpression = newExpression.replace(new RegExp(key, 'g'), `${tag}-${key}`)
  })

  return newExpression
}

Acl.checkAdvanced = (expression, rolesProvided, permissionsProvided) => {
  const roles = rolesProvided.map(role => `role-${role}`)
  const permissions = permissionsProvided.map(permission => `perm-${permission}`)

  const acl = [...roles, ...permissions]

  let normalizedExpression = normalizeExpression(rolesProvided, 'role', expression)
  normalizedExpression = normalizeExpression(permissionsProvided, 'perm', normalizedExpression)

  return check(normalizedExpression, operand => {
    return acl.includes(operand)
  })
}

Acl.validateScope = (required, provided) => {
  return _.every(required, (scope) => {
    return _.some(provided, (permission) => {
      // user.* -> user.create, user.view.self
      const regExp = new RegExp('^' + scope.replace('*', '.*') + '$')
      if (regExp.exec(permission)) {
        return true
      }
      return false
    })
  })
}

'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Acl = require('../Acl')

module.exports = class HasRole {
  register (Model) {
    Model.prototype.roles = function () {
      return this.belongsToMany('Adonis/Acl/Role').pivotTable('users_roles')
    }

    Model.prototype.getRoles = async function () {
      const roles = await this.roles().fetch()
      return roles.rows.map(({ slug }) => slug)
    }

    Model.prototype.is = async function (expression) {
      const roles = await this.getRoles()
      return Acl.check(expression, operand => _.includes(roles, operand))
    }

    Model.prototype.hasAnyRole = async function (roles) {
      if (!Array.isArray(roles)) throw new Error(`Roles need to be passed in as an array`)

      const attachedRoles = await this.getRoles()

      return roles.some(role => {
        return attachedRoles.includes(role)
      })
    }
  }
}

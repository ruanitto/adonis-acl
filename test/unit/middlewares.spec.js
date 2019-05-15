'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const test = require('japa')
const Is = require('../../src/Middlewares/Is')
const Can = require('../../src/Middlewares/Can')
const Scope = require('../../src/Middlewares/Scope')
const Init = require('../../src/Middlewares/Init')

test.group('Can Middleware', function () {
  test('should allow, when first arg is string', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedPermissions: ['edit_users', 'delete_users']
        }
      }
    }
    const can = new Can()
    await can.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, 'edit_users && delete_users')
  })

  test('should allow, when first arg is array', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedPermissions: ['edit_users', 'delete_users']
        }
      }
    }
    const can = new Can()
    await can.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, ['edit_users && delete_users'])
  })

  test('should throw error, when first arg is string', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedPermissions: []
          }
        }
      }
      const can = new Can()
      await can.handle(fakeRequest, () => { }, 'edit_users && delete_users')
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })

  test('should throw error, when first arg is array', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedPermissions: []
          }
        }
      }
      const can = new Can()
      await can.handle(fakeRequest, () => { }, ['edit_users && delete_users'])
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })
})

test.group('Is Middleware', function () {
  test('should allow, when first arg is string', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedRoles: ['administrator']
        }
      }
    }
    const is = new Is()
    await is.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, 'administrator || moderator')
  })

  test('should allow, when first arg is array', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedRoles: ['administrator']
        }
      }
    }
    const is = new Is()
    await is.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, ['administrator || moderator'])
  })

  test('should throw error, when first arg is string', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedRoles: []
          }
        }
      }
      const is = new Is()
      await is.handle(fakeRequest, () => { }, 'administrator || moderator')
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })

  test('should throw error, when first arg is array', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedRoles: []
          }
        }
      }
      const is = new Is()
      await is.handle(fakeRequest, () => { }, ['administrator || moderator'])
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })
})

test.group('Scope Middleware', function () {
  test('should allow, when required scope is spread', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedPermissions: ['users.create', 'users.delete', 'users.read']
        }
      }
    }
    const scope = new Scope()
    await scope.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, 'users.create', 'users.delete', 'users.read')
  })

  test('should allow, when required scope is array', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          preFetchedPermissions: ['users.create', 'users.delete', 'users.read']
        }
      }
    }
    const scope = new Scope()
    await scope.handle(fakeRequest, () => {
      return assert.isTrue(true)
    }, ['users.create', 'users.delete', 'users.read'])
  })

  test('should throw error, when required scope is spread', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedPermissions: []
          }
        }
      }
      const scope = new Scope()
      await scope.handle(fakeRequest, () => { }, 'users.create', 'users.delete', 'users.read')
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })

  test('should throw error, when required scope is array', async (assert) => {
    try {
      const fakeRequest = {
        auth: {
          user: {
            preFetchedPermissions: []
          }
        }
      }
      const scope = new Scope()
      await scope.handle(fakeRequest, () => { }, ['users.create', 'users.delete', 'users.read'])
    } catch (e) {
      assert.equal(e.name, 'ForbiddenException')
      assert.equal(e.message, 'Access forbidden. You are not allowed to this resource.')
    }
  })
})

test.group('Init Middleware', function () {
  test('should not add pre fetched to roles and permissions, when only user exists', async (assert) => {
    const fakeRequest = {
      auth: {
        user: {
          getRoles () {
            return ['any-role']
          },
          getPermissions () {
            return ['any-permission']
          }
        }
      }
    }
    const init = new Init()
    await init.handle(fakeRequest, () => {
      return assert.isTrue(true)
    })

    assert.doesNotHaveAllKeys(fakeRequest.auth.user, ['preFetchedPermissions', 'preFetchedRoles'])
  })

  test('should add pre fetched to roles and permissions, when user exists and view is instantiated', async (assert) => {
    const mock = []
    const fakeRequest = {
      auth: {
        user: {
          getRoles () {
            return ['any-role']
          },
          getPermissions () {
            return ['any-permission']
          }
        }
      },
      view: {
        share (...args) {
          mock.push(...args)
        }
      }
    }
    const init = new Init()
    await init.handle(fakeRequest, () => {
      return assert.isTrue(true)
    })

    assert.containsAllKeys(fakeRequest.auth.user, ['preFetchedPermissions', 'preFetchedRoles'])

    assert.containsAllKeys(mock[0], ['acl'])
    assert.equal(mock[0].acl.roles[0], 'any-role')
    assert.equal(mock[0].acl.permissions[0], 'any-permission')
  })

  test('should be able call next without pre fetched roles and permissions', async (assert) => {
    const fakeRequest = {}
    const init = new Init()
    await init.handle(fakeRequest, () => {
      return assert.isTrue(true)
    })

    assert.isEmpty(fakeRequest)
  })
})

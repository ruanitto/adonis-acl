'use strict'

const test = require('japa')
const { Macroable } = require('macroable')
const Binding = require('../../src/VowBindings/Request')

class Request extends Macroable {
  static before (fn) {
    this._hooks.push(fn)
  }
}

Request._macros = {}
Request._getters = {}
Request._hooks = []

test.group('Vow Request', (group) => {
  group.before(async () => {
    Binding(Request)
  })

  test('add roles via macro', (assert) => {
    const request = new Request()
    request.addRoles()
    assert.deepEqual(request._roles, [])
  })

  test('set roles when hook is executed', async (assert) => {
    assert.plan(1)
    const request = new Request()

    request._loginArgs = {
      options: [
        {
          roles () {
            return {
              async attach (ids) {
                assert.equal(ids[0], 1)
              }
            }
          }
        }
      ]
    }

    request.addRoles({ id: 1 })

    await Request._hooks[0](request)
  })

  test('skip authentication when addRoles was never called', async (assert) => {
    assert.plan(0)

    const request = new Request()
    await Request._hooks[0](request)
  })

  test('add permissions via macro', (assert) => {
    const request = new Request()
    request.addPermissions()
    assert.deepEqual(request._permissions, [])
  })

  test('set permissions when hook is executed', async (assert) => {
    assert.plan(1)
    const request = new Request()

    request._loginArgs = {
      options: [
        {
          permissions () {
            return {
              async attach (ids) {
                assert.equal(ids[0], 1)
              }
            }
          }
        }
      ]
    }

    request.addPermissions({ id: 1 })

    await Request._hooks[0](request)
  })

  test('skip authentication when addPermissions was never called', async (assert) => {
    assert.plan(0)

    const request = new Request()
    await Request._hooks[0](request)
  })
})

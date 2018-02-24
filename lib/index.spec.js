const _ = require('lodash')
const chai = require('chai')
const expect = chai.expect

const pluginizer = require('./index')

const dummyHemeraContainer = {
    add: (pattern, handlerFn) => {
        handlerFn({}, (err, res) => {
            expect(err).to.eql(null)
            expect(res).to.have.property('payload')
        })
    }
}

const dummySenecaContainer = {
    add: (pattern, handlerFn) => {
        if (pattern !== 'role:init') {
            handlerFn({}, (err, res) => {
                expect(err).to.eql(null)
                expect(res).to.have.property('payload')
            })
        } else {
            handlerFn({}, (err, res) => {
                expect(err).to.eql(null)
            })
        }
    }
}

const simpleFnLib = (msg, cb) => cb(null, { payload: msg })

const objectOfFnsLib = {
    fn1: (msg, cb) => cb(null, { payload: msg }),
    fn2: (msg, cb) => cb(null, { payload: msg })
}

const logicToBeCurriedWithObject = ({ container, options }) => (msg, cb) => {
    expect(_.isObject(container)).eql(true)
    expect(_.isObject(options)).eql(true)
    cb(null, { payload: options })
}
const logicToBeCurriedWithArray = (container, options) => (msg, cb) => {
    expect(_.isObject(container)).eql(true)
    expect(_.isObject(options)).eql(true)
    cb(null, { payload: options })
}

const curryObject = { container: {}, options: { test: 'test option to be curried' } }
const curryArray = [{}, { options: { test: 'test option to be curried' } }]

describe('pluginizer', () => {
    it('createHemeraPlugin - singleFn', done => {
        const hemeraPlugin = pluginizer.createHemeraPlugin(simpleFnLib, {
            type: 'singleFn',
            pattern: {
                topic: 'someTopic',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName'
        })
        expect(_.isObject(hemeraPlugin)).eql(true)
        expect(_.has(hemeraPlugin, 'plugin') && _.has(hemeraPlugin, 'options')).eql(true)
        expect(_.isFunction(hemeraPlugin.plugin) && _.isObject(hemeraPlugin.options)).eql(true)

        hemeraPlugin.plugin(dummyHemeraContainer, {}, () => {
            done()
        })
    })

    it('createHemeraPlugin - singleFn -- curried object', done => {
        const hemeraPlugin = pluginizer.createHemeraPlugin(logicToBeCurriedWithObject, {
            type: 'singleFn',
            pattern: {
                topic: 'someTopic',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName',
            curry: curryObject
        })
        expect(_.isObject(hemeraPlugin)).eql(true)
        expect(_.has(hemeraPlugin, 'plugin') && _.has(hemeraPlugin, 'options')).eql(true)
        expect(_.isFunction(hemeraPlugin.plugin) && _.isObject(hemeraPlugin.options)).eql(true)

        hemeraPlugin.plugin(dummyHemeraContainer, {}, () => {
            done()
        })
    })

    it('createHemeraPlugin - singleFn -- curried array', done => {
        const hemeraPlugin = pluginizer.createHemeraPlugin(logicToBeCurriedWithArray, {
            type: 'singleFn',
            pattern: {
                topic: 'someTopic',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName',
            curry: curryArray
        })
        expect(_.isObject(hemeraPlugin)).eql(true)
        expect(_.has(hemeraPlugin, 'plugin') && _.has(hemeraPlugin, 'options')).eql(true)
        expect(_.isFunction(hemeraPlugin.plugin) && _.isObject(hemeraPlugin.options)).eql(true)

        hemeraPlugin.plugin(dummyHemeraContainer, {}, () => {
            done()
        })
    })

    it('createHemeraPlugin - objectOfFns', done => {
        const hemeraPlugin = pluginizer.createHemeraPlugin(objectOfFnsLib, {
            type: 'objectOfFns',
            pattern: {
                topic: 'someTopic'
            },
            pluginName: 'somePluginName'
        })

        expect(_.isObject(hemeraPlugin)).eql(true)
        expect(_.has(hemeraPlugin, 'plugin') && _.has(hemeraPlugin, 'options')).eql(true)
        expect(_.isFunction(hemeraPlugin.plugin) && _.isObject(hemeraPlugin.options)).eql(true)

        hemeraPlugin.plugin(dummyHemeraContainer, {}, () => {
            done()
        })
    })
    
    it('createSenecaPlugin - singleFn', done => {
        const senecaPlugin = pluginizer.createSenecaPlugin(simpleFnLib, {
            type: 'singleFn',
            pattern: {
                role: 'someRole',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName'
        })

        expect(_.isFunction(senecaPlugin)).eql(true)

        senecaPlugin.apply(dummySenecaContainer, {})
        done()
    })

    it('createSenecaPlugin - objectOfFns', done => {
        const senecaPlugin = pluginizer.createSenecaPlugin(objectOfFnsLib, {
            type: 'objectOfFns',
            pattern: {
                role: 'someRole'
            },
            pluginName: 'somePluginName'
        })

        expect(_.isFunction(senecaPlugin)).eql(true)
        expect(_.isFunction(senecaPlugin)).eql(true)

        senecaPlugin.apply(dummySenecaContainer, {})

        done()
    })
})

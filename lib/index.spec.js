const _ = require('lodash')
const chai = require('chai')
const expect = chai.expect

const pluginizer = require('./index')

const simpleFnLib = (msg, cb) => cb(null, msg)

const objectOfFnsLib = {
    fn1: (msg, cb) => cb(null, msg),
    fn2: (msg, cb) => cb(null, msg)
}

const logicToBeCurried = ({ cont, options }) => (msg, cb) => {
    cb(null, { payload: options })
}

const curry = {
    cont: {},
    options: 'test option to be curried'
}

describe('pluginizer', () => {
    it('createHemeraPlugin - singleFn', () => {
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
    })

    it('createHemeraPlugin - singleFn -- curried', () => {
        const hemeraPlugin = pluginizer.createHemeraPlugin(logicToBeCurried, {
            type: 'singleFn',
            pattern: {
                topic: 'someTopic',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName',
            curry: curry
        })
        expect(_.isObject(hemeraPlugin)).eql(true)
        expect(_.has(hemeraPlugin, 'plugin') && _.has(hemeraPlugin, 'options')).eql(true)
        expect(_.isFunction(hemeraPlugin.plugin) && _.isObject(hemeraPlugin.options)).eql(true)
    })

    it('createHemeraPlugin - objectOfFns', () => {
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
    })
    
    it('createSenecaPlugin - singleFn', () => {
        const senecaPlugin = pluginizer.createSenecaPlugin(simpleFnLib, {
            type: 'singleFn',
            pattern: {
                role: 'someRole',
                cmd: 'someCmd'
            },
            pluginName: 'somePluginName'
        })

        expect(_.isFunction(senecaPlugin)).eql(true)
    })

    it('createSenecaPlugin - objectOfFns', () => {
        const senecaPlugin = pluginizer.createSenecaPlugin(objectOfFnsLib, {
            type: 'objectOfFns',
            pattern: {
                role: 'someRole'
            },
            pluginName: 'somePluginName'
        })

        expect(_.isFunction(senecaPlugin)).eql(true)
    })
})

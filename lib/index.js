const _ = require('lodash')

const { spiceLogic } = require('./utilities')

module.exports = {
    createHemeraPlugin: (businessLogic, options) => {
        if (options.type === 'singleFn') {
            return {
                plugin: (hemera, opts, next) => {
                    hemera.add(options.pattern, spiceLogic(businessLogic, { ...options, hemera }))

                    next()
                },
                options: {
                    name: options.pluginName
                }
            }
        }

        if (options.type === 'objectOfFns') {
            return {
                plugin: (hemera, opts, next) => {
                    _.each(spiceLogic(businessLogic, { ...options, hemera }), (fn, key) => hemera.add({
                        topic: options.pattern.topic,
                        cmd: key
                    }, fn))

                    next()
                },
                options: {
                    name: options.pluginName
                }
            }
        }
    },
    createSenecaPlugin: (businessLogic, options) => {
        const logic = spiceLogic(businessLogic, options)
        
        if (options.type === 'singleFn') {
            return function(opts) {
                const seneca = this
                
                seneca.add('role:init', (msg, respond) => respond(null))

                seneca.add(options.pattern, logic)

                return options.pluginName
            }
        }

        if (options.type === 'objectOfFns') {
            return function(opts) {
                const seneca = this

                seneca.add('role:init', (msg, respond) => respond(null))

                _.map(logic, (fn, key) => seneca.add({
                    role: options.pattern.role,
                    cmd: key
                }, fn))

                return options.pluginName
            }
        }
    }
}

const _ = require('lodash')

const { spiceLogic } = require('./utilities')

module.exports = {
    createHemeraPlugin: (businessLogic, options) => {
        const logic = spiceLogic(businessLogic, options)

        if (_.isFunction(logic)) {
            return {
                plugin: (hemera, opts, next) => {
                    hemera.add(options.pattern, logic)

                    next()
                },
                options: {
                    name: options.pluginName
                }
            }
        } else {
            return {
                plugin: (hemera, opts, next) => {
                    _.each(logic, (fn, key) => hemera.add({
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
        
        if (_.isFunction(logic)) {
            return function(opts) {
                const seneca = this
                
                seneca.add('role:init', (msg, respond) => respond(null))

                seneca.add(options.pattern, logic)

                return options.pluginName
            }
        } else {
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

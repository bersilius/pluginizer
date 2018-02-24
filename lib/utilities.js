const _ = require('lodash')

module.exports = {
    spiceLogic: (logic, options) => {
        if (options.curry) {
            if (_.isArray(options.curry)) {
                return logic(...options.curry)
            } else {
                return logic(options.curry)
            }
        }

        return logic
    }
}

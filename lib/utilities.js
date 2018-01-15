module.exports = {
    spiceLogic: (logic, options) => {
        if (options.curry) {
            return logic(options.curry)
        }

        return logic
    }
}

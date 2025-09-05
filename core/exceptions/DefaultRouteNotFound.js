const BaseException = require("./BaseException");

class DefaultRouteNotFound extends BaseException {
    constructor(moduleName) {
        super(`No default route defined for module "${moduleName}"`);
    }
}

module.exports = DefaultRouteNotFound;
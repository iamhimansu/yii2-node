const BaseException = require("./BaseException");

class RouteNotFound extends BaseException {
    constructor(moduleName) {
        super(`Route not found for module "${moduleName}"`);
    }
}

module.exports = RouteNotFound;
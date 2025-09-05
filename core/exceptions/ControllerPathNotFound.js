const BaseException = require("./BaseException");

class ControllerPathNotFound extends BaseException {
    constructor(moduleName) {
        super(`"${moduleName}" controller path not defined`);
    }
}

module.exports = ControllerPathNotFound;
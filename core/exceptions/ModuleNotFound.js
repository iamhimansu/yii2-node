const BaseException = require("./BaseException");

class ModuleNotFound extends BaseException {
    constructor(moduleName) {
        super(`"${moduleName}" cannot be instantiated`);
        this.moduleName = moduleName;
    }
}

module.exports = ModuleNotFound;
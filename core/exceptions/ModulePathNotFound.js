const BaseException = require("./BaseException");

class ModulePathNotFound extends BaseException {
    constructor(moduleName) {
        super(`"${moduleName}" path not defined`);
        this.moduleName = moduleName;
    }
}

module.exports = ModulePathNotFound;
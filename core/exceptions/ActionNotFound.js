const BaseException = require("./BaseException");

class ActionNotFound extends BaseException {
    constructor(actionName) {
        super(`Action "${actionName}" not found`);
    }
}

module.exports = ActionNotFound;
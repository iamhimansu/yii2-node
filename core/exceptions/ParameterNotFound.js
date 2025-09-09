const BaseException = require("./BaseException");

class ParameterNotFound extends BaseException {
    constructor(message) {
        super(message);
    }
}

module.exports = ParameterNotFound;
const BaseException = require("./BaseException");

class NonInstantiableClass extends BaseException {
    constructor(message) {
        super(`"${message}" is not instantiable`);
    }
}

module.exports = NonInstantiableClass;